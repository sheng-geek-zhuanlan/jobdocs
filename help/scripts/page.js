// Copyright (c) 2002-2005 Quadralay Corporation.  All rights reserved.
//

function  HTMLHelpUtility_NotifyClickedPopup()
{
  // Not a member function, need to access via variable
  //
  WebWorksHTMLHelp.mbPopupClicked = true;
}

function  HTMLHelp_Object()
{
  this.mbPopupClicked  = false;
  this.mbOverPopupLink = false;
  this.mEvent          = null;
  this.mPopup          = new HTMLHelpPopup_Object("WebWorksHTMLHelp.mPopup",
                                                  "window",
                                                  HTMLHelpUtility_NotifyClickedPopup,
                                                  "HTMLHelpPopupDIV", "HTMLHelpPopupText",
                                                  10, 12, 20, 400);
  this.mPopupLoaded    = false;

  this.fNotifyClicked  = HTMLHelp_NotifyClicked;
  this.fMouseOverPopup = HTMLHelp_MouseOverPopup;
  this.fMouseOutPopup  = HTMLHelp_MouseOutPopup;
  this.fShowPopup      = HTMLHelp_ShowPopup;
  this.fPopupLoaded    = HTMLHelp_PopupLoaded;
  this.fRevealPopup    = HTMLHelp_RevealPopup;
  this.fHidePopup      = HTMLHelp_HidePopup;
  this.fPopupDivTag    = HTMLHelp_PopupDivTag;
}

function  HTMLHelp_NotifyClicked()
{
  if (this.mbPopupClicked)
  {
    this.mbPopupClicked = false;
  }
  else if ( ! this.mbOverPopupLink)
  {
    this.fHidePopup();
  }
}

function  HTMLHelp_MouseOverPopup(ParamEvent)
{
  this.mbOverPopupLink = true;

  this.mEvent = new Object();
  this.mEvent.x = ParamEvent.x;
  this.mEvent.y = ParamEvent.y;
}

function  HTMLHelp_MouseOutPopup()
{
  this.mbOverPopupLink = false;
}

function  HTMLHelp_ShowPopup(ParamLink)
{
  var  VarHTML;

  if (this.mEvent != null)
  {
    VarHTML = "<iframe id=\"WWHPopupIFrame\" frameborder=\"0\" scrolling=\"no\" width=\"" + this.mPopup.mWidth + "\" src=\"" + ParamLink + "\" onload=\"javascript:WebWorksHTMLHelp.fPopupLoaded()\"></iframe>";
    this.mbPopupClicked = false;
    this.mPopup.fShow(VarHTML, this.mEvent);

    // WORKAROUND: Need to size popup after IFrame has loaded
    //
    if (this.mPopup.mSetTimeoutID != null)
    {
      clearTimeout(this.mPopup.mSetTimeoutID);
      this.mPopup.mSetTimeoutID = null;

      this.mPopupLoaded = false;
      this.mPopup.mSetTimeoutID = setTimeout("WebWorksHTMLHelp.fRevealPopup()", this.mPopup.mTimeout);
    }
  }

  this.mEvent = null;
}

function  HTMLHelp_PopupLoaded()
{
  var  VarPopupDocument;
  var  VarIFrame;
  var  VarElement;
  var  VarWidth;
  var  VarHeight;

  // Access popup document
  //
  VarPopupDocument = eval(this.mPopup.mWindowRef + ".document");

  // Access popup iframe
  //
  VarIFrame = VarPopupDocument.all['WWHPopupIFrame'];

  // Use documentElement, if available
  //
  if ((typeof(VarIFrame.contentWindow.document.documentElement) != "undefined") &&
      (typeof(VarIFrame.contentWindow.document.documentElement.scrollHeight) != "undefined") &&
      (typeof(VarIFrame.contentWindow.document.documentElement.offsetHeight) != "undefined"))
  {
    VarElement = VarIFrame.contentWindow.document.documentElement;
  }
  else
  {
    VarElement = VarIFrame.contentWindow.document.body;
  }

  // Set height (before width set)
  //
  VarHeight = (VarElement.scrollHeight > VarElement.offsetHeight) ? VarElement.scrollHeight : VarElement.offsetHeight;
  VarHeight += 4;
  VarIFrame.style.height = VarHeight;

  // Set width
  //
  VarWidth = (VarElement.scrollWidth > VarElement.offsetWidth) ? VarElement.scrollWidth : VarElement.offsetWidth;
  VarWidth += 4;
  if (VarWidth > this.mPopup.mWidth)
  {
    VarIFrame.style.width = VarWidth;
  }

  // Set height (after width set)
  //
  VarHeight = (VarElement.scrollHeight > VarElement.offsetHeight) ? VarElement.scrollHeight : VarElement.offsetHeight;
  VarHeight += 4;
  VarIFrame.style.height = VarHeight;

  this.mPopupLoaded = true;
}

function  HTMLHelp_RevealPopup()
{
  if (this.mPopupLoaded)
  {
    this.mPopup.mSetTimeoutID = setTimeout(this.mPopup.mThisPopupRef + ".fReveal()", 1);
  }
  else
  {
    this.mPopup.mSetTimeoutID = setTimeout("WebWorksHTMLHelp.fRevealPopup()", this.mPopup.mTimeout);
  }
}

function  HTMLHelp_HidePopup()
{
  this.mPopup.fHide();
}

function  HTMLHelp_PopupDivTag()
{
  return this.mPopup.fDivTagText();
}
