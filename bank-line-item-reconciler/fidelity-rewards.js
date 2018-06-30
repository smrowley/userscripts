// ==UserScript==
// @name         Fidelity Rewards CC Reconciler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Line item reconciliation for Fidelity Rewards online statements
// @author       Shane Rowley
// @match        https://login.fidelityrewards.com/onlineCard/transactionDetails.do
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }

    function populateRow(remainingTotal, lastAmount, index, array) {
        if (index >= array.length) {
            return;
        }

        var tr = array[index];

        if (hasClass(tr, 'hide')) {
            populateRow(remainingTotal, lastAmount, index + 1, array);
        } else {

            var td = document.createElement('td');
            var calculated = remainingTotal - lastAmount;

            td.innerHTML = '<span>$' + calculated.toFixed(2) + '</span>';

            var currentAmount = parseFloat(tr.getElementsByClassName('amountCol_resp')[0].children[0].innerHTML.replace(/(\$|\,)/g,'')).toFixed(2);

            tr.appendChild(td);

            populateRow(calculated, currentAmount, index + 1, array);
        }
    }

    setTimeout(function() {
        var elements = document.getElementsByClassName('summaryValue');
        var span = elements[0].children[0];
        var total = parseFloat(span.innerHTML.replace(/(\$|\,)/g,'')).toFixed(2);

        var table = document.getElementById('transactionDetailTable_completed');
        var thead = table.getElementsByTagName('thead')[0];
        var tbody = table.getElementsByTagName('tbody')[0];

        var th = document.createElement('th');
        th.innerHTML = 'Balance';
        thead.children[0].appendChild(th);

        populateRow(total, 0.0, 0, tbody.children);

    }, 2000);
})();
