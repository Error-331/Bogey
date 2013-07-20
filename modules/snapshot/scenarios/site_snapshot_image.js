// Modules include
var scenario = require('../../core/scenario');
var fileutils = require('../../utils/fileutils');

var args = require('system').args;
var page = require('webpage').create();

var SiteSnapshotImage = function()
{ 
    scenario.constFunc.call(this, 'site_snapshot_image');
    
    /* Private members starts here */
    
    /**
     * @access private
     * @var object link to the current object
     */        
    
    var obj = this;      
    
    /**
     * @access private
     * @var string URL to the page which snapshot will be taken
     */     
       
    var url = '';
    
    /**
     * @access private
     * @var string path to directory where snapshot file will be stored
     */        
    
    var dirPath = '';    
    
    /**
     * @access private
     * @var string extension of the image file (image format)
     */        
    
    var imgFormat = 'png';
    
    /**
     * @access private
     * @var string snapshot filename
     */     
    
    var imgName = 'untitled';    
            
    /* Private members ends here */  
    
    /* Private core methods starts here */
    
    /**
     * Method that extracts arguments from the command line.
     *
     * Method extracts all arguments needed to take snapshot of the page (such as URL, image format etc.), validates them and 
     * saves them to the current object.
     *
     * @access private
     * 
     * @throws string 
     * 
     */ 

    function extractDataFromArgs()
    {   
        if (args.length < 2) {
            obj.setIsError(true);
            obj.setErrorDesc('Usage: site_url image_path [png|jpeg|gif|pdf] [snapshot_image_name]');
            obj.stop();
        } else if (args.length == 2) {
            setURL(args[1]);
        } else if (args.length == 3) {
            setURL(args[1]);
            setImagePath(args[2]);
        } else if (args.length == 4) {
            setURL(args[1]);
            setImagePath(args[2]);
            setImageFormat(args[3]);  
        } else if (args.length >= 5) {
            setURL(args[1]);
            setImagePath(args[2]);
            setImageFormat(args[3]);  
            setImgName(args[4]);            
        }     
    }  
    
    
    /**
     * Method that actually makes page snapshot.
     *
     * Simple method that makes page snapshot.
     *
     * @access private
     * 
     */     
    
    function takeSnapshot()
    {
        page.open(url, function () {
            page.render(dirPath + imgName + '.' + imgFormat);
            obj.stop();
        });
    }
    
    /* Private core methods ends here */   
    
    /* Private get methods starts here */    
    /* Private get methods ends here */
    
    /* Private set methods starts here */  
    
    /**
     * Method that sets URL of the page which snapshot will be taken.
     *
     * Simple method that sets URL of the page which snapshot will be taken.
     *
     * @access private
     * 
     * @param string usrURL page URL
     * 
     * @throws string 
     * 
     */      
    
    function setURL(usrURL)
    {
        if (typeof usrURL != 'string') {
            throw 'Snapshot URL is not a string';
        }
        
        if (usrURL.length == 0) {
            throw 'Snapshot URL length is zero';
        }
            
        url = usrURL;            
    }
    
    /**
     * Method that sets path to the directory where snapshots will be stored.
     *
     * Simple method that sets path to the directory where snapshots will be stored.
     *
     * @access private
     * 
     * @param string path to the directory
     * 
     * @throws string 
     * 
     */          
    
    function setImagePath(path)
    {        
        if (fileutils.isPathWritable(path)) {
            dirPath = fileutils.addSeparator(path)
        }
    }
    
    /**
     * Method that sets extension of the snapshot file.
     *
     * Snapshot file can be one of the following format: png, gif, jpeg, pdf.
     *
     * @access private
     * 
     * @param string format file extension (format)
     * 
     * @throws string 
     * 
     */      
    
    function setImageFormat(format)
    {
        imgFormat = fileutils.checkImgExt(format);            
    }
    
    /**
     * Method that sets name of the snapshot file.
     *
     * Simple method that sets name of the snapshot file.
     *
     * @access private
     * 
     * @param string name snapshot filename
     * 
     * @throws string 
     * 
     */     
    
    function setImgName(name)
    {    
        imgName = fileutils.checkImgName(name);
    }
    
    /* Private set methods ends here */ 
    
    /* Privileged core methods starts here */
    
    /**
     * Method that starts current scenario.
     *
     * @access privileged
     * 
     */      
    
    this.start = function() 
    {   
        try {
            extractDataFromArgs();
            takeSnapshot();            
        } catch(e) {
            obj.setIsError(true);
            obj.setErrorDesc(e);
            obj.stop();
        }      
    }  
    
    /**
     * Method that stops current scenario.
     *
     * Method sends response based on the information stored in the current object and calls phantom.exit().
     *
     * @access privileged
     * 
     */    
    
    this.stop = function() 
    {   
        var result = {
            'url': url,
            'path': dirPath,
            'format': imgFormat,
            'name': imgName
        };
                
        if (obj.getIsError() == true) {
            obj.sendErrorResponse(obj.getErrorDesc());
        } else {
            obj.sendResponse(result);
        }
        
        phantom.exit();
    }      
        
    /* Privileged core methods ends here */    
}

SiteSnapshotImage.prototype = scenario.create('site_snapshot_image');
new SiteSnapshotImage('site_snapshot_image').start();