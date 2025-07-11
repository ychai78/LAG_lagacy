$(document).ready(function () {
    // Prevent form submission when clicking the checkout button
    $('#checkoutBtn').on('click', function(event) {
        event.preventDefault(); // Prevents the default form submission
        window.location.href = 'https://www.lagirlusa.com/checkout'; // Redirects to the desired URL
    });

    var freeShippingMin = 3500; // Free shipping threshold in cents

    // Function to format price
    function formatPrice(price) {
        return (price / 100).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    // Function to update the cart details
    function updateCartDetails(cart) {

        var cartTotal = cart.original_total_price ;
        var progressPercent = Math.min((cartTotal / freeShippingMin) * 100, 100); // Calculate progress percentage
  
        // Update progress bar width
        var progressBar = $('.cart-header__progress-bar');
        progressBar.css('width', progressPercent + '%');

      
        // Update the total quantity in the cart header
        var totalQuantityElement = $('.cart-total-quantity');
        totalQuantityElement.text('(' + cart.item_count + ' ' + (cart.item_count === 1 ? 'Item' : 'Items') + ')');

        // Update the cart-summary-total-items
        var cartSummaryTotalItemsElement = $('.cart-summary-total-items');
        cartSummaryTotalItemsElement.text('Subtotal (' + cart.item_count + ' ' + (cart.item_count === 1 ? 'Item' : 'Items') + ')');

        // Update the cart-summary-product-value
        var cartSummaryProductValueElement = $('.cart-summary-product-value');
        cartSummaryProductValueElement.text(formatPrice(cart.original_total_price));

        // Determine shipping cost and free shipping status
        var shippingCost = (cart.original_total_price >= freeShippingMin) ? 0 : 1000;
        var freeShipping = (cart.original_total_price >= freeShippingMin);

        // Update the cart-summary-price-total-value
        var cartSummaryPriceTotalValueElement = $('.cart-summary-price-total-value');
        var updatedTotalPrice = cart.original_total_price + shippingCost;
        cartSummaryPriceTotalValueElement.text(formatPrice(updatedTotalPrice));

        // Update the cart-summary-shipping-value
        var cartSummaryShippingValueElement = $('.cart-summary-shipping-value');
        var updatedShippingCost = freeShipping ? 'FREE' : formatPrice(1000);
        cartSummaryShippingValueElement.text(updatedShippingCost);

        // Update the cart-header__announcement-message
        var announcementMessageElement = $('.cart-header__announcement-message');
        if (freeShipping) {
            announcementMessageElement.html('You qualify for free shipping!');
        } else {
            var remainingAmount = formatPrice(freeShippingMin - cart.original_total_price);
            announcementMessageElement.html('Add <span class="free-shipping">' + remainingAmount + '</span> more for free shipping.');
        }
    }

    // Update quantity
    $('body').on('click', '.increment-qty, .decrement-qty', function (event) {
        event.preventDefault(); // Prevent the default behavior
        var variantId = $(this).data('variant-id');
        var $quantityInput = $('input.quantity-input[data-variant-id="' + variantId + '"]');
        var currentQuantity = parseInt($quantityInput.val());
        var newQuantity = $(this).hasClass('increment-qty') ? currentQuantity + 1 : currentQuantity - 1;

        if (newQuantity < 1) return;

        $.ajax({
            type: 'POST',
            url: '/cart/update.js',
            data: {
                updates: { [variantId]: newQuantity },
            },
            dataType: 'json',
            success: function (cart) {
                // Update the quantity input field
                $quantityInput.val(newQuantity);

                // Update the cart details
                updateCartDetails(cart);

                // Update the line-item__unitPrice
                var lineItem = cart.items.find(item => item.variant_id == variantId);
                var unitPriceElement = $('#line-item-unit-price-' + variantId);
                if (lineItem.quantity > 1) {
                    var formattedUnitPrice = formatPrice(lineItem.price);
                    unitPriceElement.text(lineItem.quantity + ' @ ' + formattedUnitPrice);
                } else {
                    unitPriceElement.empty(); // Hide the unit price if quantity is 1
                }

                // Update the line-item__item-price
                var totalPriceElement = $('#line-item-price-' + variantId);
                var formattedTotalPrice = formatPrice(lineItem.final_line_price);
                totalPriceElement.text(formattedTotalPrice);
            },
            error: function (error) {
                console.error('Error updating cart', error);
            },
        });
    });

    // Remove item from cart
    $('body').on('click', '.btn-remove-item', function (event) {
        event.preventDefault();
        var variantId = $(this).data('variant-id');
        var $cartItem = $('#cart-item-card-' + variantId); // Use the new ID


        $.ajax({
            type: 'POST',
            url: '/cart/change.js',
            data: {
                id: variantId,
                quantity: 0,
            },
            dataType: 'json',
            success: function (cart) {
                // Remove the item from the DOM
                $cartItem.remove();
              
                // Update the cart details
                updateCartDetails(cart);
            },
            error: function (error) {
                console.error('Error removing item from cart', error);
            },
        });
    });

    // Ensure the tooltip function is accessible globally
    window.showTooltip = function(tooltipId) {
        var tooltip = document.getElementById(tooltipId);
        tooltip.style.display = "block";

        // Hide the tooltip after a certain time (e.g., 3 seconds)
        setTimeout(function() {
            tooltip.style.display = "none";
        }, 3000);
    }
});
