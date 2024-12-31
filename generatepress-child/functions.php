<?php
// Enqueue parent theme styles.
add_action( 'wp_enqueue_scripts', function() {
    wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
});

function enqueue_custom_forminator_script() {
    wp_enqueue_script(
        'custom-forminator-validation',
        get_stylesheet_directory_uri() . '/js/custom-forminator-validation.js',
        [], // No dependencies
        null,
        true // Load in the footer
    );
    // Log the script loading
    error_log('Script enqueued: ' . get_stylesheet_directory_uri() . '/js/custom-forminator-validation.js');
}
add_action('wp_enqueue_scripts', 'enqueue_custom_forminator_script');

add_action('wp_enqueue_scripts', function() {
    error_log('Stylesheet Directory Path: ' . get_stylesheet_directory_uri());
    error_log('Custom JS Path: ' . get_stylesheet_directory_uri() . '/js/custom-forminator-validation.js');
});

// code for preventing br tags

add_filter('forminator_custom_form_html', function($content) {
    return preg_replace('/<br\s*\/?>/', '', $content); // Remove <br> tags
});


// code for displaying stats


add_shortcode('display_code_stats', function() {
    global $wpdb;

    // Define the table for Forminator meta data
    $table_name = $wpdb->prefix . 'frmt_form_entry_meta';

    // Define the meta_key to filter (e.g., 'text-1')
    $meta_key = 'text-1';

    // Fetch the meta_values for the specific meta_key
    $results = $wpdb->get_results(
        $wpdb->prepare(
            "SELECT meta_value FROM $table_name WHERE meta_key = %s",
            $meta_key
        ),
        ARRAY_A
    );

    // Count occurrences of each code
    $code_usage = [];
    foreach ($results as $row) {
        $code = $row['meta_value'];
        if (!empty($code)) {
            if (isset($code_usage[$code])) {
                $code_usage[$code]++;
            } else {
                $code_usage[$code] = 1;
            }
        }
    }

    // Define personalized messages for each code
    $code_messages = [
        'MAGIC123' => 'Wellness Beta Archive.',
        'HEALTH456' => 'Health Beta.',
        'LUCKY789' => 'Beta.',
        // Add more codes and messages as needed
    ];

    // Generate the output list
    $output = '<ul>';
    if (!empty($code_usage)) {
        foreach ($code_usage as $code => $count) {
            $message = isset($code_messages[$code]) 
                ? $code_messages[$code] 
                : 'This code has been used to access the Beta Archive.'; // Default message

            $output .= '<li>' 
                . esc_html($code) . ': ' 
                . esc_html($count) . ' People Have Accessed. ' 
                . esc_html($message) 
                . '</li>';
        }
    } else {
        $output .= '<li>No data available.</li>';
    }
    $output .= '</ul>';

    return $output; // Return the HTML to render on the page
});

//code to avoid menu theme js conflict features

function dequeue_generatepress_menu_script() {
    wp_dequeue_script('generate-menu'); // 'generate-menu' is the script handle for menu.min.js
    wp_deregister_script('generate-menu');
}
add_action('wp_enqueue_scripts', 'dequeue_generatepress_menu_script', 20);
