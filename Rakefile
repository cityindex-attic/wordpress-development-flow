  require 'fileutils' 
  require 'nokogiri'

  # handle Exceptions
  def WPFlow_Error( e )
    line, *rest = e.backtrace[1].split(':in')
    puts "\n *********************** ".bg_magenta
    puts " | WP Development Flow | ".bg_magenta
    puts " *********************** \n".bg_magenta
    puts e
    puts "Ruby rake error:"
    puts "  Error: ".red.bg_magenta + e.message.bg_magenta
    puts "  In line: " + line
    exit
  end

  # colorize stdOut.
  # @see http://stackoverflow.com/a/16363159/288644
  class String
    def red;            "\033[31m#{self}\033[0m" end
    def bg_magenta;     "\033[45m#{self}\033[0m" end
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
        sh "git clone -b fix-ci-wdf https://github.com/mrdavidlaing/stackato-buildpack-wordpress.git #{ENV['STACKATO_APP_ROOT']}/buildpack"     
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

  ##
  desc "Metrics"
  ##
  namespace :metrics do

    def metrics_init(type, name)
      puts "type: #{type}"
      puts "name: #{name}"
      $logs_dir = "#{ENV['STACKATO_DOCUMENT_ROOT']}/public/metrics/#{type}/#{name}/logs"
      $files_dir = "#{ENV['STACKATO_DOCUMENT_ROOT']}/public/metrics/#{type}/#{name}"
      $source = "#{ENV['STACKATO_DOCUMENT_ROOT']}/public/wp-content/#{type}/#{name}"
      $bin = "/app/app/runtimes/php/bin" 

      begin
        unless File.exists?("#{$source}")
          puts "#{type} #{name} does not exist"
          exit
        end
        unless Dir.exists?($logs_dir)
          sh "mkdir -p #{$logs_dir}"
        end
        unless Dir.exists?($files_dir)
          sh "mkdir -p #{$files_dir}"
        end
        unless Dir.exists?("#{}{$files_dir}/clover")
          sh "mkdir -p #{$files_dir}/clover"
        end
        unless File.exists?("#{$files_dir}/index.php")
          sh "cp /app/app/.build/metrics.index.php #{$files_dir}/index.php"
        end
        unless File.exists?("#{$files_dir}/.htaccess")
          htaccess = File.open("#{$files_dir}/.htaccess", "w+")
          htaccess.puts "DirectoryIndex index.php"
          htaccess.close
        end
      rescue => e
        WPFlow_Error(e)
      end
    end

    task :phploc, :type, :name do |task, args|
      metrics_init args.type, args.name
      sh "#{$bin}/phploc --log-csv #{$logs_dir}/phploc.csv #{$source} || true"
    end

    task :pdepend, :type, :name do |task, args|
      metrics_init args.type, args.name
      jdepend_xml = "#{$logs_dir}/jdepend.xml"
      jdepend_chart = "#{$files_dir}/dependencies.svg"
      overview_pyr = "#{$files_dir}/overview-pyramid.svg"
      sh "#{$bin}/pdepend --jdepend-xml=#{jdepend_xml} --jdepend-chart=#{jdepend_chart} --overview-pyramid=#{overview_pyr} #{$source}"
    end

    task :phpmd, :type, :name do |task, args|
      metrics_init args.type, args.name
      sh "#{$bin}/phpmd #{$source} xml design --reportfile #{$logs_dir}/phpmd.xml"
      sh "#{$bin}/phpmd #{$source} xml #{$logs_dir}/phpmd.xml --reportfile #{$logs_dir}/pmd.xml"
    end

    task :phpcs, :type, :name do |task, args|
      metrics_init args.type, args.name
      sh "#{$bin}/phpcs --report=checkstyle --report-file=#{$logs_dir}/checkstyle.xml --standard=WordPress -vvv -l -n #{$source} > /dev/null || true"
    end

    task :phpcpd, :type, :name do |task, args|
      metrics_init args.type, args.name
      sh "#{$bin}/phpcpd --log-pmd #{$logs_dir}/pmd-cpd.xml #{$source}"
    end

    task :phpunit, :type, :name do |task, args|
      metrics_init args.type, args.name
      begin
        if not [ File.exists?("/app/app/public/unit-tests") ]
          1/0
        end
       rescue
          puts "No unit tests found. Please run:"
          puts "    rake metrics:phpunit_init"
          exit
      end

      if [ args.type=='plugins' ]; then
          begin
            sh "wp scaffold plugin-tests #{args.name} --path='/app/app/public'" unless File.exists?("#{$source}/tests")
            f = File.open("#{$source}/phpunit.xml", "a+")
            doc = Nokogiri::XML(f)
            unless doc.at_css('filter')
              doc.at('phpunit') << '
                <filter>
                        <whitelist>
                                <directory suffix=".php">/app/app/public/wp-content/' + args.type + '/' + args.name + '</directory>
                                <exclude>
                                  <directory suffix=".php">../../../unit-tests</directory>
                                  <directory suffix=".php">./tests</directory>
                                </exclude>
                        </whitelist>
                </filter>
                <logging>
                        <log type="coverage-html" target="/app/app/public/metrics/plugins/foo/clover/" charset="UTF-8" yui="true" highlight="true"/>
                        <log type="coverage-clover" target="/app/app/public/metrics/' + args.type + '/' + args.name + '/logs/clover.xml"/>
                </logging>
              '
              xml = File.open("#{$source}/phpunit.xml", "w+")
              xml.puts doc.to_xml
              xml.close
            end
          rescue => e
            WPFlow_Error(e)
          end
          #f.close
      end
        
      sh "phpunit -c #{$source}/phpunit.xml || true"
    end

    task :phpunit_init, :type, :name do |task, args|
      metrics_init args.type, args.name
      sh ".build/runtime-components/install-wp-testsuite"
    end

  end

  ##
  desc "Metrics: phploc, pdepend, phpmd, phpcs, phpcpd, phpunit"
  ##
  task :metrics, :type, :name do |t, args|
    Rake::Task["metrics:phploc"].invoke( args.type, args.name )
    Rake::Task["metrics:pdepend"].invoke( args.type, args.name )
    Rake::Task["metrics:phpmd"].invoke( args.type, args.name )
    Rake::Task["metrics:phpcs"].invoke( args.type, args.name )
    Rake::Task["metrics:phpcpd"].invoke( args.type, args.name )
    Rake::Task["metrics:phpunit"].invoke( args.type, args.name )
  end

  namespace :dev_server do
    task :backup_db do
      begin
        time = Time.now.to_i
        file = "/app/app/db/wordpress.#{time}.sql"
        sh "mysqldump -u root -psecret_password wordpress > #{file} 2> /dev/null"
        puts "created #{file}"
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
