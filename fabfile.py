from fabric.api import *
from fabric.operations import *
from fabric.utils import *
from fabric.contrib.files import *
from fabric.colors import green, yellow, red

"""
Base configuration
"""
env.project_name = 'Headline-node'
env.path = '/home/foodblogs/site/%(project_name)s' % env
env.repo_path = env.path
env.branch = 'master'

env.hosts = ['news.optfantasy.com:22']
env.user = 'foodblogs'


def checkout_latest():
    """
    Pull the latest code on the specified branch.  Overwrites any local
    configuration changes.
    """
    print yellow("Pulling latest source...")

    with prefix('cd %(repo_path)s' % env):
        #sudo('chown -R %(user)s %(path)s' % env)
        run('git reset --hard HEAD')
        run('git checkout %(branch)s' % env)
        run('git pull origin %(branch)s' % env)

def restart():
    print yellow("Restart the services...")
    with prefix('cd %(repo_path)s' % env):
        run('pm2 kill');
        run('pm2 start server.js ');
        run('pm2 start runCronJobs.js');

def deploy():
    checkout_latest()
    restart()



