// Christophe Savard
// 40017812
// COMP-371 WW 
// Assignment 1
// Feburary 8th 2018

#pragma once
#include <GLFW/glfw3.h>

/**
 * \brief Register all GL callbacks
 */
void registerCallbacks();

/**
 * \brief GL frame resize callback
 * \param window Window being resized
 * \param width  New width
 * \param height New height
 */
void framebuffer_size_callback(GLFWwindow* window, int width, int height);

/**
 * \brief Mouse movement over the screen callback
 * \param window Window over which the cursor is moving
 * \param xpos X position of the mouse
 * \param ypos Y position of the mouse
 */
void mouse_callback(GLFWwindow* window, double xpos, double ypos);

/**
 * \brief Keyboar press callback
 * \param window   Window in which the keys are pressed
 * \param key      Key being pressed
 * \param scancode Unique identifier
 * \param action   Type of press
 * \param mods     Key modifiers
 */
void key_callback(GLFWwindow* window, int key, int scancode, int action, int mods);

/**
 * \brief Generates a random integer value between the min and max values inclusively
 * \param min Minimum value
 * \param max Maximum value
 * \return    The randomly generated integer
 */
static int randomRange(const int min, const int max);