  require 'fileutils'
  require 'guard'

  ##
  desc "delete created assets"
  ##
  task :clean do
    sh "rm -rf ./dist"
  end

  ##
  desc "copy files and directories"
  ##
  task :copy do
    @source = "src"
    @target = "dist"
    @pattern = "/**/*"
    files = FileList.new("#{@source}#{@pattern}").exclude(/\.less$/i)
    task_header("Copy")

    files.each do |file|
      #create target location file string (replace source with target in path)  
      targetLocation = file.sub(@source, @target)  
      #ensure directory exists  
      FileUtils.mkdir_p(File.dirname(targetLocation));  
      #copy the file  
      FileUtils.cp_r(file, targetLocation)  
      puts "\tcopying #{file} to #{targetLocation}"
    end
    puts "\n"
  end
  #end copy files and directories

  ##
  desc "Watch files"
  ##
  task :watcher do
    Guard.setup
    Guard::Dsl.evaluate_guardfile(:guardfile => 'Guardfile', :group => 'Frontend')
    Guard.run_all({})
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
      sh "git clone git://github.com/mrdavidlaing/stackato-buildpack-wordpress.git ./buildpack"
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
          sh "mysql -uroot -psecret_password wordpress < wordpress.sample.sql"
        end
      end
    end
    task :server_start do
      task_header("Starting server")
      sh "cd ~/dist/ && bin/start.sh 4567 Verbose" # 'sh' streams the cmnd's stdout
    end
    task :all => [:mysql, :server_start] do
    end
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

  ##
  desc "run  => [:build, :verify_hosting_dependencies, dev_server:all]"
  ##
  task :run => [:build, :verify_hosting_dependencies, "dev_server:all"]

  ##
  desc "default => [:run]"
  ##
  task :default => [:run] do
    DEMO_VAL = 4
    puts "Ready for the day!"
    puts ""
  end
  #end default

  def task_header(title)
    puts "\n##########################"
    puts "#\t#{title}"
    puts "##########################"
  end