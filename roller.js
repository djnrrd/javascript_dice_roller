/* Dice roller javascript - Originally for Nightbot

This script will take a text string "XdY", and roll a dice of size Y, X times.

Modifiers can be added "XdY+Z", or "XdY-Z" and single dice rolled as "dY"

Fudge dice can also be rolled using "4df"

Source originally unknown, modified by DJNrrd
*/

// Nightbot will replace $(1) with the first word after the command
var cmd_input = "$(1)";

// The function that actually does the roll, requires a value for "r"
function roll(roll_txt) {
  /* Split "roll_txt" into an array, using the characters "d", "-", and "+" as separators. 
     "2d8" becomes ["2", "8"]
  */
  var cmd_parts = roll_txt.split(/[d+-]/);
  // Default to one roll
  var times_to_roll = 1;
  // Is there anything in the first item in "cmd_parts", or is it empty text?
  if (cmd_parts[0].length > 0) {
    // Turn that item into an decimal Integer
    times_to_roll = Number.parseInt(cmd_parts[0], 10);
    // Assign the lower value between the input and 1000
    times_to_roll = Math.min(times_to_roll, 1000);
  }
  // If the second value in "cmd_parts" is "f" then we are using Fudge dice, otherwise convert to a decimal Integer
  var size_of_dice = cmd_parts[1];
  var fudge = false;
  if(size_of_dice == "f") {
    size_of_dice = 3;
    fudge =true;
  }
  else{
    size_of_dice = Number.parseInt(size_of_dice, 10);
  }
  // Default modifier of 0
  var modifier = 0;
  // Are there more than 2 parts to the original command?
  if (cmd_parts.length > 2) {
    // Turn that item into an Integer
    modifier = Number.parseInt(cmd_parts[2], 10);
  }
  // Search the original text for the position of a "-" character, if that character is not present -1 is returned
  if (roll_txt.indexOf("-") != -1) {
    // If a position number is returned, convert the modifier to a negative nuumber
    modifier = modifier * -1;
  }
  // Start the total value
  var total_value = modifier;
  // Create an empty array to store the rolls in
  var dice_rolls = [];
  /* Start a loop while the value of "loop" is less than "times_to_roll"
       After each iteration, add 1 to the value of "loop"
    */
  for (loop = 0; loop < times_to_roll; ++loop) {
    // Random floating point number between 0 (inclusive) and 1 (exclusive)
    var rnd_val = Math.random();
    // Multiply by size of dice, this could be 0 and never the size of dice, so we add one
    var dice_roll = rnd_val * size_of_dice;
    dice_roll = dice_roll + 1;
    // Round the number DOWN to the nearest integer
    dice_roll = Math.floor(dice_roll);
    // If we are using fudge dice, conver the values
    if(fudge == true) {
        dice_roll = -2 + dice_roll
    }
    // Add the value of the roll to the total result. Append the array of rolls with the result
    total_value = total_value + dice_roll;
    dice_rolls.push(dice_roll);
  }
  // Convert the total value into a text string again
  var txt_output = `${total_value}`;
  // If we've got multiiple rolls
  if (times_to_roll < 30 && times_to_roll > 1) {
    txt_output += ` [${dice_rolls}]`;
  }
  // If there was a modifier
  if (modifier != 0) {
    var original_rolls = total_value - modifier;
    txt_output += ` (modified: `;
    txt_output += `${original_rolls}`;
    if (modifier < 0) {
      txt_output += "-";
    } else {
      txt_output += "+";
    }
    txt_output += `${Math.abs(modifier)}`;
    txt_output += ")";
  }
  // Finally return the text result, which starts with the text of the total result, "i"
  return txt_output;
}
// Run the function
roll(cmd_input);
