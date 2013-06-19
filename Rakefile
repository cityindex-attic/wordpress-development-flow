  require 'fileutils'

  ##
  desc "Git refresh buildpack"
  ##
  task :refresh_buildpack do
    task_header("Refresh Buildpack")

    if Dir.exists?("/app/buildpack/.git")
      puts "\tUpdating buildpack"
      sh "cd #{ENV['STACKATO_APP_ROOT']}/buildpack && git reset --hard HEAD"
      sh "cd #{ENV['STACKATO_APP_ROOT']}/buildpack && git pull"
    else
      puts "\tCloning buildpack"
      sh "git clone https://github.com/mrdavidlaing/stackato-buildpack-wordpress.git #{ENV['STACKATO_APP_ROOT']}/buildpack"     
    end
  end
  #end Git refresh buildpack
 
  ##
  desc "compile buildpack"
  ##
  task :compile_buildpack do
    task_header("Compile")
    sh "#{ENV['STACKATO_APP_ROOT']}/buildpack/bin/compile #{ENV['STACKATO_DOCUMENT_ROOT']} #{ENV['STACKATO_APP_ROOT']}/.buildpack-cache"
  end
  #end compile buildpack

  ##
  desc "stackato release"
  ##
  task :release, :deployName, :username, :password do |t, args|
    task_header("Release")
    sh "./build/release-to-stackato #{args[:deployname]} #{args[:username]} #{args[:password]}"
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

  desc "[:refresh_buildpack, :compile_buildpack]"
  task :build => [:refresh_buildpack, :compile_buildpack]
  desc "[:build]"
  task :rebuild => [:build]

  namespace :dev_server do
    task :server_start do
      task_header("Starting server (HipHop PHP) - browse to http://localhost:4567")
      sh "#{ENV['STACKATO_DOCUMENT_ROOT']}/bin/start.sh 4567 Info" # 'sh' streams the cmnd's stdout
    end
    task :ti_debug do
      task_header("Starting browser based debug server (ti-debug)")
      sh "/usr/local/ti-debug/bin/dbgp --server *:9222 &" 
    end
    task :server_start_debug do
      task_header("Starting server (PHP 5.4 Dev server with browser based debugger) - browse to http://localhost:4567")
      sh "#{ENV['STACKATO_DOCUMENT_ROOT']}/bin/start.sh 4567 Debug" 
    end
    task :server_start_debug_ide do
      task_header("Starting server (PHP 5.4 Dev server with XDebug) - have your IDE debugger listening on 0.0.0.0:9000 and then browse to http://localhost:4567")
      sh "#{ENV['STACKATO_DOCUMENT_ROOT']}/bin/start.sh 4567 Debug_IDE" 
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
  end   

  ##
  desc "Metrics"
  ##
  namespace :metrics do

    name = "#{ENV['name']}"
    type = "#{ENV['type']}"
    logs_dir = "#{ENV['STACKATO_DOCUMENT_ROOT']}/public/metrics/#{type}/logs/#{name}"
    files_dir = "#{ENV['STACKATO_DOCUMENT_ROOT']}/public/metrics/#{type}/#{name}"
    source = "#{ENV['STACKATO_DOCUMENT_ROOT']}/public/wp-content/#{type}/#{name}"

    task :init do
      unless Dir.exists?(logs_dir)
        sh "mkdir -p #{logs_dir}"
      end
      unless Dir.exists?(files_dir)
        sh "mkdir -p #{files_dir}"
      end
    end

    task :phploc => [:init] do
      sh "phploc --log-csv #{logs_dir}/phploc.csv #{source}"
    end

    task :pdepend => [:init] do
      jdepend_xml = "#{logs_dir}/jdepend.xml"
      jdepend_chart = "#{files_dir}/dependencies.svg"
      overview_pyr = "#{files_dir}/overview-pyramid.svg"
      sh "pdepend --jdepend-xml=#{jdepend_xml} --jdepend-chart=#{jdepend_chart} --overview-pyramid=#{overview_pyr} #{source}"
    end

    task :phpmd => [:init] do
      sh "phpmd #{source} xml design --reportfile #{logs_dir}/phpmd.xml"
      sh "phpmd #{source} xml #{logs_dir}/phpmd.xml --reportfile #{logs_dir}/pmd.xml"
    end

    task :phpcs => [:init] do
      sh "phpcs --report=checkstyle --report-file=#{logs_dir}/checkstyle.xml --standard=WordPress -vvv -l -n #{source} > /dev/null || true"
    end

    task :phpcpd => [:init] do
      sh "phpcpd --log-pmd #{logs_dir}/pmd-cpd.xml #{source}"
    end

    task :phpunit => [:init] do
      sh "phpunit --coverage-clover #{logs_dir}/clover.xml --coverage-html #{files_dir} #{source} || true"
    end

  end

  ##
  desc "Metrics: phploc, pdepend, phpmd, phpcs, phpcpd, phpunit"
  ##
  task :metrics do
    Rake::Task["metrics:phploc"].invoke
    Rake::Task["metrics:pdepend"].invoke
    Rake::Task["metrics:phpmd"].invoke
    Rake::Task["metrics:phpcs"].invoke
    Rake::Task["metrics:phpcpd"].invoke
    Rake::Task["metrics:phpunit"].invoke
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
