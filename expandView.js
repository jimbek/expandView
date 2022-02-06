jQuery.fn.extend({

  expandAll: function() {
    return this.each(function() {
      //Loop will stop when all items with children are opened
      let stop = false;
      while (!stop) {
        stop = true;
        let items = this.querySelectorAll('.expand-item');

        for (let i = 0; i < items.length; i++) {
          //Get value from "mod" property of "arrow" element
          let mod = $(items[i]).children()[0].getAttribute('expand-item-mod');
          //Get value from "expand-item-has-children" property of "arrow" element
          let hasChildren = $(items[i]).children()[0].getAttribute('expand-item-has-children');
          //Call "click()" function if the element is collapsed and has sub items
          if (mod == 'off' && hasChildren == 'true') {
            let arrowElement = $($(items[i]).children()[0]);
            arrowElement.click();
            stop = false;
          }
        }
      }
    });
  },

  collapseAll: function() {
    return this.each(function() {
      //Loop will stop when all items with children are collapsed
      let stop = false;
      while (!stop) {
        stop = true;
        let items = this.querySelectorAll('.expand-item');

        for (let i = 0; i < items.length; i++) {
          //Get value from "mod" property of "arrow" element
          let mod = $(items[i]).children()[0].getAttribute('expand-item-mod');
          //Call "click()" function if the element is opened
          if (mod == 'on') {
            let arrowElement = $($(items[i]).children()[0]);
            arrowElement.click();
            stop = false;
          }
        }
      }
    });
  },

  expand: function(children, closeIcon, openIcon) {
    return this.each(function() {
      //Find elements with the same "expand-item-id" property
      let expandItemId = this.getAttribute('expand-item-id');
      let expandItemElements = document.querySelectorAll('[expand-item-id="' + expandItemId + '"]');
      
      for (let i = 0; i < expandItemElements.length; i++) {
        let elementClass = expandItemElements[i].getAttribute('class');
        
        //Check if the element is the "arrow" element that we are looking for
        if (elementClass.includes('expand-item-details')) {
          //We show children items
          if (elementClass.includes('expand-hidden')) {
            //Update "expand-item-mod" property
            this.setAttribute('expand-item-mod', 'on');

            //Fetch children items
            $(expandItemElements[i]).expandView({
              items: children()
            });

            this.innerHTML = openIcon == undefined ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill" viewBox="0 0 16 16"><path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/></svg>' : openIcon;
            expandItemElements[i].classList.remove('expand-hidden');
          } else {
            //Update "expand-item-mod" property
            this.setAttribute('expand-item-mod', 'off');

            //We hide "details" div
            this.innerHTML = closeIcon == undefined ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>' : closeIcon;
            expandItemElements[i].classList.add('expand-hidden');
          }

          //We found the "arrow" element so we stop searching
          break;
        }
      }
    });
  },

  expandView: function(options) {
    return this.each(function() {
      //The updated innerHTML
      let html = '';

      //Add toolbar
      if (options.toolbar != undefined) {
        html += '<div class="expand-toolbar">'

        for (let i = 0; i < options.toolbar.length; i++) {
          html += options.toolbar[i];
        }

        html += '</div>';
      }
      
      //Check if there are any items
      if (options.items != undefined) {
        for (let i = 0; i < options.items.length; i++) {
          //We increase "margin-left" by "1em"
          let marginLeft = (typeof(this.style.marginLeft) == 'string' ? 0 : this.style.marginLeft) + 1;

          html += '<div expand-item-id="' + options.items[i].id + '" class="expand-item"' + ' style="margin-left:' + marginLeft + 'em;">';

          //Add left arrow
          let hasChildren = options.items[i].children != undefined;
          html += '<div expand-item-id="' + options.items[i].id + '"' + ' expand-item-index="' + i + '" expand-item-has-children="' + hasChildren +'"' +' expand-item-mod="off" class="expand-item-arrow">';
          
          if (hasChildren) {
            if (options.items[i].open == undefined || options.items[i].open == false) {
              html += options.items[i].closeIcon == undefined ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>' : options.items[i].closeIcon;
            } else {
              html += options.items[i].openIcon == undefined ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill" viewBox="0 0 16 16"><path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/></svg>' : options.items[i].openIcon;
            }
          }
          
          html += '</div>';

          //Add title
          html += '<div expand-item-id="' + options.items[i].id + '" class="expand-item-title">';
          html += options.items[i].title;
          html += '</div>';

          //Add total children
          if (options.items[i].totalChildren != undefined) {
            html += '<div expand-item-id="' + options.items[i].id + '" class="expand-item-total-children"><span style="vertical-align: middle;">';
            
            let totalChildren = options.items[i].totalChildren > 99 ? '99+' : options.items[i].totalChildren;
            html += totalChildren;
            
            html += '</span></div>';
          }

          html += '</div>';

          let loadingText = options.items[i].loadingText == undefined ? 'Loading...' : ('<div class="expand-item-loading">' + options.items[i].loadingText + '</div>');
          html += '<div expand-item-id="' + options.items[i].id +'" class="expand-item-details expand-hidden" style="margin-left:' + marginLeft + 'em;">' + loadingText + '</div>';
        }
      }

      //Update the innerHTML
      this.innerHTML = html;

      //Update JQuery elements
      let children = $(this).children();

      for (let i = 0; i < children.length; i++) {
        //Check if the element is "expand-item"
        if (children[i].classList.contains('expand-item')) {
          //Get value from "expand-item-index" property of "arrow" element
          let index = parseInt($(children[i]).children()[0].getAttribute('expand-item-index'));
          //Implement "click()" function if the element has sub items
          if (options.items[index].children != undefined) {
            let arrowElement = $($(children[i]).children()[0]);

            arrowElement.click(function() {
              arrowElement.expand(options.items[index].children, options.items[index].closeIcon, options.items[index].openIcon);
            });

            //If item is by default open, we show it's nested items
            if (options.items[index].open == true) {
              arrowElement.expand(options.items[index].children, options.items[index].closeIcon, options.items[index].openIcon);
            }
          }
        }
      }

    });
  }
  
});