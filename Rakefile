  require 'fileutils'


  ##
  # copy files and directories
  ##
  task :copy do
    @source = "src"
    @target = "dist"
    @pattern = "/**/*"
    files = FileList.new("#{@source}#{@pattern}").exclude(/\.less$/i)
    
    files.each do |file|
      #create target location file string (replace source with target in path)  
      targetLocation = file.sub(@source, @target)  
      #ensure directory exists  
      FileUtils.mkdir_p(File.dirname(targetLocation));  
      #copy the file  
      FileUtils.cp_r(file, targetLocation)  
      puts "copying #{file} to #{targetLocation}"
    end
  end
  #end copy files and directories


  task :refresh_buildpack do
    puts "Refresh buildpack"
  end


  task :compile do
    puts "compile"
  end


  ##
  # dev server setup
  ##
  namespace :dev_server do
    task :mysql do
      puts "Setting up database..."
      puts `mysqladmin -uroot -psecret_password create wordpress` # 'puts' prevents db exists error from failing build
    end
    task :server_start do
      puts "Starting server..."
      sh "cd ~/dist/ && bin/start.sh 4567 Verbose" # 'sh' streams the cmnd's stdout
    end
    task :all => [:mysql, :server_start] do
    end
  end
  #end dev server setup


  task :release do
    puts "release"
  end


  task :verify_hosting_dependencies do
    val = ENV["DEMO_VAL"] || 2
    puts "verify hosting dependencies #{val}"
  end


  task :default => [:copy, :refresh_buildpack, :compile, "dev_server:all", :release, :verify_hosting_dependencies] do
    DEMO_VAL = 4
    puts "Ready for the day!"
    puts ""
  end