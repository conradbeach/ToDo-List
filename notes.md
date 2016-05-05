The left navigation bar is a fixed width. On the non-mobile layout, the main content area adjusts in size as the screen size shrinks, but the navigation does not.
I would try floating the nav to the left and then make the main content area take up the full width of the remaining screen.

Hamburger menu icon is not displayed on the desktop layout.
Perhaps to get the right behavior for the nav on the mobile layout, have a hidden checkbox inside a label along with the hamburger icon. When the hamburger is clicked, the checkbox is activated and you switch the nav from it's default display of hidden to block or whatever.

Have a <div> or something that contains the modal. Have that <div> hidden by default (maybe with a class of "hidden"). If a class is added (or perhaps changed to "show") to the <div> in the HTML, then the modal shows up. Have all the modal styles in one rule block. Then have a single line rule for ".hidden" and ".show" that toggles the display.
