<?php
	/**
	 * GIT DEPLOYMENT SCRIPT
	 *
	 * Used for automatically deploying websites via github or bitbucket, more deets here:
	 * https://gist.github.com/riodw/71f6e2244534deae652962b32b7454e2
	 * How To Use:
	 * https://medium.com/riow/deploy-to-production-server-with-git-using-php-ab69b13f78ad
	 */
	function deploy() {
		// The commands
		$commands = array(
			'echo $PWD',
			'whoami',
			'git reset --hard HEAD',
			'git pull',
			'git status',
			'git submodule sync',
			'git submodule update',
			'git submodule status',
		);
		// Run the commands for output
		$output = '';
		foreach($commands AS $command){
			// Run it
			$tmp = shell_exec($command);
			// Output
			$output .= $command . "\n" . $tmp . "\n";
		}
		return $output;
	}
?>