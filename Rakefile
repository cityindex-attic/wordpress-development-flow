  require 'fileutils'
  require 'listen'

  ##
  desc "delete created assets"
  ##
  task :clean do
    puts "Deleting dist/"
    sh 'rm -rf dist/'
  end

  ##
  desc "copy files and directories"
  ##
  task :copy do
    task_header("Copy")

    files = FileList.new("src/**/*").exclude(/\.less$/i)
    files.each do |src_file|
      copy_src_file_to_dist src_file
    end
  end
  #end copy files and directories

  def copy_src_file_to_dist(src_file)
    targetLocation = src_file.sub('src/', 'dist/')  
    puts "\tcopying #{src_file} to #{targetLocation}"
    
    FileUtils.mkdir_p(File.dirname(targetLocation));  
    FileUtils.cp(src_file, targetLocation) unless File.directory?(src_file)
  end

  watcher_changes_callback = Proc.new do |modified_list, added_list, removed_list|
    puts "watcher triggered"
    (modified_list << added_list).flatten.each do |file|
      copy_src_file_to_dist file
    end
    removed_list.each do |removed|
      targetLocation = removed.sub('src/', 'dist/')  
      puts "\tdeleting #{targetLocation}"
      FileUtils.rm(targetLocation)  
    end
  end

  ##
  desc "Watch files"
  ##
  task :watcher do
    task_header("Watch files")
    listener = Listen.to('src')
    listener.change(&watcher_changes_callback)
    listener.start(false) # non-blocking execution
    puts "Started watcher on src/"
  end
  #end watch files

  ##
  desc "Git refresh buildpack"
  ##
  task :refresh_buildpack do
    task_header("Refresh Buildpack")

    if Dir.exists?("./buildpack/.git")
      puts "\tUpdating buildpack"
      sh "git --git-dir ./buildpack/.git reset --hard HEAD"
      sh "git --git-dir ./buildpack/.git pull"
    else
      puts "\tCloning buildpack"
      sh "git clone https://github.com/mrdavidlaing/stackato-buildpack-wordpress.git ./buildpack"     
    end
  end
  #end Git refresh buildpack

  ##
  desc "compile buildpack"
  ##
  task :compile_buildpack do
    task_header("Compile")
    sh "./buildpack/bin/compile ./dist ./.buildpack-cache"
  end
  #end compile buildpack

  ##
  desc "dev server setup"
  ##
  namespace :dev_server do
    task :mysql do
      task_header("Setting up MySql")
      sh "mysqladmin -uroot -psecret_password create wordpress" do |ok,res|
        if ok
          sh "mysql -uroot -psecret_password wordpress < tests/wordpress.sample.sql"
        end
      end
    end
    task :server_start do
      task_header("Starting server (HipHop PHP) - browse to http://localhost:4567")
      sh "dist/bin/start.sh 4567 Info" # 'sh' streams the cmnd's stdout
    end
    task :ti_debug do
      task_header("Starting browser based debug server (ti-debug)")
      sh "/usr/local/ti-debug/bin/dbgp --server *:9222 &" 
    end
    task :server_start_debug do
      task_header("Starting server (PHP 5.4 Dev server with browser based debugger) - browse to http://localhost:4567")
      sh "dist/bin/start.sh 4567 Debug" 
    end
    task :server_start_debug_ide do
      task_header("Starting server (PHP 5.4 Dev server with XDebug) - have your IDE debugger listening on 0.0.0.0:9000 and then browse to http://localhost:4567")
      sh "dist/bin/start.sh 4567 Debug_IDE" 
    end
    task :all_debug_ide => [:mysql, :watcher, :server_start_debug_ide] 
    task :all_debug => [:mysql, :watcher, :ti_debug, :server_start_debug] 
    task :all => [:mysql, :watcher, :server_start] 
  end
  #end dev server setup

  ##
  desc "stackato release"
  ##
  task :release, :deployName, :username, :password do |t, args|
    task_header("Release")
    stackatoBaseUri = "stackato.cil.stack.me"
    puts "deploying to url: http://#{args[:deployName]}.#{args[:stackatoBaseUri]}"
    sh "stackato target https://api.#{stackatoBaseUri}"
    sh "stackato login #{args[:username]} --pass #{args[:password]}"
    sh "stackato push #{args[:deployName]} --no-prompt --path ./dist" do |ok,res|
      if ! ok
        sh "stackato update #{args[:deployName]} --no-prompt --path ./dist"
      end
    end
  end
  #end stackato release

  ##
  desc "verify hosting dependencies"
  ##
  task :verify_hosting_dependencies do
    task_header("Verifying hosting dependencies")
    if File.exists?("/usr/bin/mysql")
      puts "All dependencies look good"
    else
      fail "MySql must be installed"
    end
  end
  #end verify hosting dependencies

  desc "[:copy, :refresh_buildpack, :compile_buildpack]"
  task :build => [:copy, :refresh_buildpack, :compile_buildpack]
  desc "[:clean, :build]"
  task :rebuild => [:clean, :build]

  desc "Start dev server (HipHop)"
  task :run => [:build, :verify_hosting_dependencies, "dev_server:all"]
  namespace :run do
    desc "Start dev server (PHP 5.4 with browser based debugger)"
    task :debug => [:build, :verify_hosting_dependencies, "dev_server:all_debug"]

    desc "Start dev server (PHP 5.4 with XDebug)"
    task :debug_ide => [:build, :verify_hosting_dependencies, "dev_server:all_debug_ide"]
  end

  ##
  desc "test => [:copy, :watcher]"
  ##
  task :test => [:copy, :watcher]

  ##                                                                                            
  desc "Generating wordpress documentation"                                                     
  ##                                                                                            
  task :docs, :type, :name do |t, args|                                                         
    source = "/home/vagrant/dist/public/wp-content/#{args.type}/#{args.name}"                   
    target = "/home/vagrant/dist/public/docs/#{args.type}/#{args.name}"                         
    puts "Generating docs..."                                                                   
    puts "Source: #{source}"                                                                    
    puts "Target: #{target}"                                                                    
                                                                                                
    #get source switch for phpdoc                                                               
    if File.extname(source) == ".php"                                                           
      source_switch = "-f #{source}"                                                            
    else                                                                                        
      source_switch = "-d #{source}"                                                            
    end                                                                                         
    #end get source                                                                             
                                                                                                
    FileUtils.mkdir_p( target )                                                                 
                                                                                                
    sh "phpdoc -t #{target} #{source_switch}"                                                   
  end   
                                                      
  ##                                                                                           
  task :default => [:run] do
    puts "Ready for the day!"
    puts ""
  end
  #end default

  def task_header(title)
    banner = "#" * (title.length + 4)
    puts "\n#{banner}"
    puts "# #{title} #" 
    puts "#{banner}"
  end
