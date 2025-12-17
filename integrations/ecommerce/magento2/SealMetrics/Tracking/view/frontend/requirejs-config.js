/**
 * Sealmetrics Tracking Module for Magento 2
 * RequireJS Configuration
 */
var config = {
    map: {
        '*': {
            'sealmetricsTracking': 'Sealmetrics_Tracking/js/tracking',
            'sealmetricsCart': 'Sealmetrics_Tracking/js/cart-tracking'
        }
    },
    config: {
        mixins: {
            'Magento_Catalog/js/catalog-add-to-cart': {
                'Sealmetrics_Tracking/js/catalog-add-to-cart-mixin': true
            }
        }
    }
};
