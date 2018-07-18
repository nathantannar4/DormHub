'use strict'

const childProcess = require('child_process');
const args = [ 'start' ];
const opts = { stdio: 'inherit', cwd: 'app', shell: true };

childProcess.spawn('npm', args, opts);
