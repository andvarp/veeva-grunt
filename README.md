# Getting Started
****Full Developer guide is located in IVA Confluence page: 
### Installation
- You need to Install *Node.js*
    - On windows, download the installer from http://nodejs.org/download/
    - On Mac, you can either download the installer from http://nodejs.org/download/ or if you use Homebrew, do
    ```sh
    $ brew install node
    ```
- Once Node.js is installed, use Terminal to install *grunt-cli* using *npm*
    - ```sh
    $ npm install -g grunt-cli
    ```
- Then run *npm install* to download the dependencies for this project, *cd* to the same directory as this README.txt file
    - ```sh
    $ cd code/
    $ npm install
    ```
    
### Running the Project
#####Compile
The command **grunt** is used to compile the *.hbs* files to HTML files and will output the resulting built site to the *web/* directory. To do a build, run 
- ```sh
$ grunt
```
***Note**: You may need to run this command every time you modify the code.
    
There are two environments that you can use for building the site ***dev***, or ***prod***. The default environment is ***dev***. In order to change the target environment, please run 

- ```sh
    $ grunt --target=dev 
    $ grunt --target=prod
```
***Note**: This will affect the navigations URLs from Veeva, because pages are hosted on two different enviroments, and each URL per slide are different.
    
#####Zip
The command **grunt zip** is used to compile the project, take screenshots for all the slides, and compress each slide folder into a zip file. The output of this command will be on *zip/* directory.
- ```sh
    $ grunt zip 
```

### Folder Structure
All the code is inside ***src*** folder.

![folder structure](http://placehold.it/385x825)
#####Shared Assets
On this folder you will, find *styles*, *images*, *javascripts*, *json* of all the global layouts.
#####Shared Data
On this folder you will find, the whole menu/submenu configuration, as well as the root paths of all projects.
#####Shared Layouts
On this folder you will find, all the different handlebars layouts used on the site. You can create multiple layouts, and choose which one you want to use on each single page.
#####All Pages
All pages from the different brands are created inside this folder.
#####Single Page
Each single page is created on this folder, for further detail please check the section **[Create a Slide/Page](#create-a-slide-page)**
#####Shared content among pages
All the content that is repeated on almost all the pages like headers, menus, submenus, disclaimers are defined here. These files can be called/imported from the layouts or single pages.
#####Configuration scripts
All the files that *nodejs*, and *grunt* need to run the project are located here.
#####Web folder
Here you can find the compiled project after the **[grunt](#compile)** command
#####Zip Folder
Here you can find each slide of the project, zipped in separated files. This folder will be created after you run **[grunt zip](#zip)** command

### Slide/Page Structure
All the slides must have the following file structure:
```sh
iva-stb-000-home
├── assets
├── ├── css
├── ├── ├── styles.css
├── ├── img
├── ├── js
├── ├── ├── slide.js
├── index.hbs
```
