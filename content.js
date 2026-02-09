// Content script for Amazon Orders page.
// This script injects a "Returns" tab into the page-tabs section on the
// "Your Orders" page. It runs after the page has loaded and watches
// the DOM for updates to ensure the tab is added even if the nav is
// rendered asynchronously.

(function () {
  /**
   * Insert the Returns tab into the orders page if it does not already exist.
   */
  function addReturnsTab() {
    // Locate the container that holds the existing tabs. Amazon uses
    // a `.page-tabs` wrapper with an inner <ul> element.
    const container = document.querySelector('.page-tabs ul');
    if (!container) {
      return;
    }

    // Check whether a Returns tab is already present to avoid duplicates.
    const existing = container.querySelector('a[href*="/your-returns"]');
    if (existing) {
      return;
    }

    // Construct the new list item and anchor.
    const li = document.createElement('li');
    li.className = 'page-tabs__tab';
    const anchor = document.createElement('a');
    anchor.className = 'a-link-normal';
    anchor.href =
      'https://www.amazon.com/your-returns?ref_=orc_spr_return_center_view_your_returns&ingress=return_center';
    anchor.textContent = 'Returns';
    li.appendChild(anchor);

    // Append the new tab to the existing list.
    container.appendChild(li);
  }

  // Run once when the DOM is ready.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addReturnsTab);
  } else {
    addReturnsTab();
  }

  // Observe mutations to handle asynchronous content loading. The
  // Amazon orders page may update the tab bar after initial load;
  // monitoring the body ensures the Returns tab is inserted when
  // necessary.
  const observer = new MutationObserver(() => {
    addReturnsTab();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();