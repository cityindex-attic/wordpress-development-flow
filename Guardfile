guard :shell do
  watch /src\/(.*)/ do |m|
    `touch #{m[0]}` #Ensures hiphop will notice the change and recompile
  end
end

# Any files created or modified in the 'source' directory
# will be copied to the 'target' directory. Update the
# guard as appropriate for your needs.
guard :copy, :from => 'src', :to => 'dist', :mkpath => true