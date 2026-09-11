(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var wrapper = document.getElementById('treatment-search');
    var input = document.getElementById('treatment-search-input');
    var clearBtn = document.getElementById('treatment-search-clear');
    var emptyMsg = document.getElementById('treatment-search-empty');
    var grid = document.getElementById('treatment-grid');
    if (!wrapper || !input || !grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-treatment-card]'));

    // Wrap each list item's label text in its own span (leaving the bullet
    // dot span untouched) so we can highlight matches without losing markup.
    cards.forEach(function (card) {
      var h3 = card.querySelector('h3');
      if (h3) h3.dataset.original = h3.textContent;

      var items = card.querySelectorAll('li');
      items.forEach(function (li) {
        var textNode = Array.prototype.slice.call(li.childNodes).find(function (n) {
          return n.nodeType === Node.TEXT_NODE && n.textContent.trim().length;
        });
        if (!textNode) return;
        var span = document.createElement('span');
        span.className = 'li-text';
        span.dataset.original = textNode.textContent;
        span.textContent = textNode.textContent;
        li.replaceChild(span, textNode);
      });
    });

    function setHighlighted(el, query) {
      var original = el.dataset.original;
      if (!query) {
        el.textContent = original;
        return;
      }
      var idx = original.toLowerCase().indexOf(query);
      if (idx === -1) {
        el.textContent = original;
        return;
      }
      el.textContent = '';
      el.appendChild(document.createTextNode(original.slice(0, idx)));
      var mark = document.createElement('mark');
      mark.className = 'ts-highlight';
      mark.textContent = original.slice(idx, idx + query.length);
      el.appendChild(mark);
      el.appendChild(document.createTextNode(original.slice(idx + query.length)));
    }

    function filterTreatments(rawQuery) {
      var query = rawQuery.trim().toLowerCase();
      wrapper.classList.toggle('has-value', query.length > 0);

      var anyVisible = false;
      cards.forEach(function (card) {
        var h3 = card.querySelector('h3');
        var spans = Array.prototype.slice.call(card.querySelectorAll('.li-text'));

        if (h3) setHighlighted(h3, query);
        spans.forEach(function (span) { setHighlighted(span, query); });

        var matches = true;
        if (query) {
          var h3Match = h3 && h3.dataset.original.toLowerCase().indexOf(query) !== -1;
          var liMatch = spans.some(function (span) {
            return span.dataset.original.toLowerCase().indexOf(query) !== -1;
          });
          matches = h3Match || liMatch;
        }

        card.hidden = !matches;
        if (matches) anyVisible = true;
      });

      if (emptyMsg) emptyMsg.hidden = !(query.length > 0 && !anyVisible);
    }

    input.addEventListener('input', function (e) { filterTreatments(e.target.value); });
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        input.value = '';
        filterTreatments('');
        input.focus();
      });
    }
  });
})();
