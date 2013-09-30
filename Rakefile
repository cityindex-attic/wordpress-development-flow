  require 'fileutils' 
  require 'nokogiri'

  # handle Exceptions
  def WPFlow_Error( e )
    line, *rest = e.backtrace[1].split(':in')
    puts "\n *********************** ".bg_magenta
    puts " | WP Development Flow | ".bg_magenta
    puts " *********************** \n".bg_magenta
    puts "Ruby rake error:"
    puts "  Error: ".red.bg_magenta + e.message.bg_magenta
    puts "  In line: " + line
  end

  # colorize stdOut.
  # @see http://stackoverflow.com/a/16363159/288644
  class String
    def red;            "\033[31m#{self}\033[0m" end
    def bg_magenta;     "\033[45m#{self}\033[0m" end
  end

  task :foo do
      puts "bling blang"
      1/0
  end
  task :bar do |t, args|
    begin
      1/0
    rescue => e
      WPFlow_Error(e)
    end
  end

  ##
  desc "Git refresh buildpack"
  ##
  task :refresh_buildpack do
    begin
      task_header("Refresh Buildpack")

      if Dir.exists?("/app/buildpack/.git")
        puts "\tUpdating buildpack"
        sh "cd #{ENV['STACKATO_APP_ROOT']}/buildpack && git reset --hard HEAD"
        sh "cd #{ENV['STACKATO_APP_ROOT']}/buildpack && git pull"
      else
        puts "\tCloning buildpack"
        sh "git clone https://github.com/mrdavidlaing/stackato-buildpack-wordpress.git #{ENV['STACKATO_APP_ROOT']}/buildpack"     
      end
    rescue => e
      WPFlow_Error(e)
    end
  end
  #end Git refresh buildpack
 
  ##
  desc "compile buildpack"
  ##
  task :compile_buildpack do
    begin
      task_header("Compile")
      sh "#{ENV['STACKATO_APP_ROOT']}/buildpack/bin/compile #{ENV['STACKATO_DOCUMENT_ROOT']} #{ENV['STACKATO_APP_ROOT']}/fs/buildpack-cache"
    rescue => e
      WPFlow_Error(e)
    end
  end

  ##
  desc "stackato release"
  ##
  task :release, :deployName, :username, :password do |t, args|
    begin
      task_header("Release")
      sh "./build/release-to-stackato #{args[:deployname]} #{args[:username]} #{args[:password]}"
    rescue => e
      WPFlow_Error(e)
    end
  end
  #end stackato release

  ##
  desc "verify hosting dependencies"
  ##
  task :verify_hosting_dependencies do
    begin
      task_header("Verifying hosting dependencies")
      if File.exists?("/usr/bin/mysql")
        puts "All dependencies look good"
      else
        fail "MySql must be installed"
      end
    rescue => e
      WPFlow_Error(e)
    end
  end
  #end verify hosting dependencies

  desc "[:refresh_buildpack, :compile_buildpack]"
  task :build => [:refresh_buildpack, :compile_buildpack]
  desc "[:build]"
  task :rebuild => [:build]

  namespace :dev_server do
    task :foo do
      begin
        1/0
      rescue => e
        WPFlow_Error(e)
      end
    end
    task :server_start do
      begin
        task_header("Starting server (HipHop PHP) - browse to http://localhost:4567")
        sh "#{ENV['STACKATO_DOCUMENT_ROOT']}/bin/start.sh 4567 Info" # 'sh' streams the cmnd's stdout
      rescue => e
        WPFlow_Error(e)
      end
    end
    task :ti_debug do
      begin
        task_header("Starting browser based debug server (ti-debug)")
        sh "/usr/local/ti-debug/bin/dbgp --server *:9222 &" 
      rescue => e
        WPFlow_Error(e)
      end
    end
    task :server_start_debug do
      begin
        task_header("Starting server (PHP 5.4 Dev server with browser based debugger) - browse to http://localhost:4567")
        sh "#{ENV['STACKATO_DOCUMENT_ROOT']}/bin/start.sh 4567 Debug" 
      rescue => e
        WPFlow_Error(e)
      end
    end
    task :server_start_debug_ide do
      begin
        task_header("Starting server (PHP 5.4 Dev server with XDebug) - have your IDE debugger listening on 0.0.0.0:9000 and then browse to http://localhost:4567")
        sh "#{ENV['STACKATO_DOCUMENT_ROOT']}/bin/start.sh 4567 Debug_IDE" 
      rescue => e
        WPFlow_Error(e)
      end
    end
    task :all_debug_ide => [:server_start_debug_ide] 
    task :all_debug => [:ti_debug, :server_start_debug] 
    task :all => [:server_start] 
  end
 
  desc "Start dev server (HipHop)"
  task :run => [:build, :verify_hosting_dependencies, "dev_server:all"]
  namespace :run do
    desc "Start dev server (PHP 5.4 with browser based debugger)"
    task :debug => [:build, :verify_hosting_dependencies, "dev_server:all_debug"]

    desc "Start dev server (PHP 5.4 with XDebug)"
    task :debug_ide => [:build, :verify_hosting_dependencies, "dev_server:all_debug_ide"]
  end

  ##                                                                                            
  desc "Generating wordpress documentation"                                                     
  ##                                                                                            
  task :docs, :type, :name do |t, args|                                                         
    begin
      source = "#{ENV['STACKATO_DOCUMENT_ROOT']}/public/wp-content/#{args.type}/#{args.name}"                   
      target = "#{ENV['STACKATO_DOCUMENT_ROOT']}/public/docs/#{args.type}/#{args.name}"                         
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
    rescue => e
      WPFlow_Error(e)
    end
  end   
                                                      
  def task_header(title)
    banner = "#" * (title.length + 4)
    puts "\n#{banner}"
    puts "# #{title} #" 
    puts "#{banner}"
  end
