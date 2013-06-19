#!/usr/bin/env ruby
require 'listen'
require 'fileutils'

puts "rsyncing /vagrant/ -> /app/app"
`rsync -a --exclude='.git*' --exclude='.vagrant' --exclude='.DS_Store' /vagrant/ /app/app/`

puts "Watching /vagrant for new changes ..."
Listen.to("/vagrant/", :ignore => /\.build|\.git|\.vagrant/, :force_polling => true, :latency => 0.5 ) do |modified, added, removed|
	
	puts "Detected new files #{added.inspect}" unless added.empty?
	puts "Detected modifications to #{modified.inspect}" unless modified.empty?
	(modified << added).flatten.each do |src_file|
    targetLocation = src_file.sub('/vagrant/', '/app/app/')  
		puts "\tcopying #{src_file} to #{targetLocation}"

		FileUtils.mkdir_p(File.dirname(targetLocation));  
		FileUtils.cp(src_file, targetLocation) unless File.directory?(src_file)
  end

  unless removed.empty? 
		 puts "Detected deleted files #{removed.inspect}"
		 removed.each do |removed_file|
      targetLocation = removed_file.sub('/vagrant/', '/app/app/')  
      puts "\tdeleting #{targetLocation}"
      FileUtils.rm(targetLocation)  
    end
	end

	$stdout.flush

end
