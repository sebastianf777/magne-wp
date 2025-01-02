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

// Shortcode to display code stats with a wrapper for AJAX updates
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
        'WELL333' => 'Wellness Beta Archive.',
        'INFO3201' => 'Information Beta Archive',
        'ROBOTS52' => 'Robots Beta Archive',
        // Add more codes and messages as needed
    ];

    // Generate the output list
    $output = '<ul>';
    if (!empty($code_usage)) {
        foreach ($code_usage as $code => $count) {
            $message = isset($code_messages[$code]) 
                ? $code_messages[$code] 
                : 'People Have Accessed the unknown Beta Archive.'; // Default message

            $output .= '<li>' 
                . esc_html($code) . ': ' 
                . esc_html($count) . ' People Have Accessed the ' 
                . esc_html($message) 
                . '</li>';
        }
    } else {
        $output .= '<li>No data available.</li>';
    }
    $output .= '</ul>';

    // Wrap the stats in a container for AJAX updates
    return '<div id="code-stats">' . $output . '</div>';
});

//code to avoid menu theme js conflict features

function dequeue_generatepress_menu_script() {
    wp_dequeue_script('generate-menu'); // 'generate-menu' is the script handle for menu.min.js
    wp_deregister_script('generate-menu');
}
add_action('wp_enqueue_scripts', 'dequeue_generatepress_menu_script', 20);

// Register admin page for resetting code stats
add_action('admin_menu', function() {
    add_menu_page(
        'Reset Code Stats',            // Page title
        'Reset Code Stats',            // Menu title
        'manage_options',              // Capability
        'reset-code-stats',            // Menu slug
        'reset_code_stats_page',       // Callback function
        'dashicons-trash',             // Icon
        20                             // Position
    );
});

// Admin page content
function reset_code_stats_page() {
    global $wpdb;

    // Define the table and meta_key
    $table_name = $wpdb->prefix . 'frmt_form_entry_meta';
    $meta_key = 'text-1';

    // Handle form submission
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['reset_code'])) {
        $code_to_reset = sanitize_text_field($_POST['reset_code']);

        if (!empty($code_to_reset)) {
            // Delete all entries for the specific code
            $deleted_rows = $wpdb->query(
                $wpdb->prepare(
                    "DELETE FROM $table_name WHERE meta_key = %s AND meta_value = %s",
                    $meta_key,
                    $code_to_reset
                )
            );

            // Show success message
            echo '<div class="updated"><p>Reset successful! ' . esc_html($deleted_rows) . ' entries removed for code: ' . esc_html($code_to_reset) . '</p></div>';
        } else {
            echo '<div class="error"><p>Please enter a valid code to reset.</p></div>';
        }
    }

    // Display admin form
    ?>
    <div class="wrap">
        <h1>Reset Code Stats</h1>
        <form method="post">
            <label for="reset_code">Enter Code to Reset:</label>
            <input type="text" name="reset_code" id="reset_code" required>
            <button type="submit" class="button button-primary">Reset Code Stats</button>
        </form>
    </div>
    <?php
}
