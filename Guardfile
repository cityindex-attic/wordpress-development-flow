# Any files created or modified in the 'source' directory
# will be copied to the 'target' directory. Update the
# guard as appropriate for your needs.
guard :copy, :from => 'src', :to => 'dist', 
			:mkpath => true, :verbose => true, :run_at_start => true do
	watch(%r{src})
end