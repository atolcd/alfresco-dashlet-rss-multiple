"Multiple RSS Feed" dashlet for Alfresco Share
================================

Unlike the default dashlet provided by Alfresco, this dashlet allows you to subscribe to **several feeds**!  
The dashlet aggregates multiple feeds, sorted by date (a color can be selected for each feed to differentiate feed items).  

Building the module
-------------------
Check out the project if you have not already done so 

        git clone git://github.com/atolcd/alfresco-dashlet-rss-multiple.git

An Ant build script is provided to build JAR file **OR** AMP file containing the custom files.  

To build JAR file, run the following command from the base project directory:

        ant dist-jar

If you want to build AMP file, run the following command:

        ant dist-amp


Installing the module
---------------------
This extension is a standard Alfresco Module, so experienced users can skip these steps and proceed as usual.

### 1st method: Installing JAR (recommended)
1. Stop Alfresco
2. Copy `multiple-rss-feeds-share-dashlet-X.X.X.jar` into the `/tomcat/shared/lib/` folder of your Alfresco (you might need to create this folder if it does not already exist).
3. Start Alfresco


### 2nd method: Installing AMPs
1. Stop Alfresco
2. Use the Alfresco [Module Management Tool](http://wiki.alfresco.com/wiki/Module_Management_Tool) to install the module in your Share WAR file:

        java -jar alfresco-mmt.jar install multiple-rss-feeds-share-dashlet-vX.X.X.amp $TOMCAT_HOME/webapps/share.war -force

3. Delete the `$TOMCAT_HOME/webapps/share/` folder.  
**Caution:** please ensure you do not have unsaved custom files in the webapp folder before deleting.
4. Start Alfresco



Using the module
---------------------
Add the dashlet on your (site/user) dashboard.  
  
Customize your user dashboard: `http://server:port/share/page/customise-user-dashboard`  
Customize a site dashboard: `http://server:port/share/page/site/{siteId}/customise-site-dashboard` (only available for site managers)  


LICENSE
---------------------
This extension is licensed under `GNU Library or "Lesser" General Public License (LGPL)`.  
Created by: [Bertrand FOREST] (https://github.com/bforest)  


Our company
---------------------
[Atol Conseils et Développements] (http://www.atolcd.com) is Alfresco [Gold Partner] (http://www.alfresco.com/partners/atol)  
Follow us on twitter [ @atolcd] (https://twitter.com/atolcd)  