
#Predix Experience 2.0 Seed
Welcome Package is an application that uses <a href="https://github.build.ge.com/pages/PXc/pxc-demos/" target="_blank">Px Web Components</a> and <a href="https://github.build.ge.com/pages/PXd/px-library-design/" target="_blank">Px UI Elements</a> inside an Angular application.  See the running <a href="welcomepack.run.aws-usw02-pr.ice.predix.io" target="_blank">demo</a>.

  	  
To Run the Welcome Package

Get the source code

Make a directory for your project. Clone or download and extract the seed in that directory.

git clone
Install the dependencies

npm install
bower install
Create a dist version

Use grunt to create a distribution version of your app, which will be located in the dist folder along with the nginx configuration files. You will need to run this command during development every time before you cf push to make the latest dist.

grunt dist

## Questions?
- Ask questions and file tickets on <a href="https://predix.ge.com/community/" target="_blank">predix.ge.com/community</a>.

# Copyright
Copyright &copy; 2015 GE Global Research. All rights reserved.

The copyright to the computer software herein is the property of
GE Global Research. The software may be used and/or copied only
with the written permission of GE Global Research or in accordance
with the terms and conditions stipulated in the agreement/contract
under which the software has been supplied.
