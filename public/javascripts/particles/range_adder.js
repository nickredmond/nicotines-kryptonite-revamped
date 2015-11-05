var current_range_number = 1;

function add_range(id, min, max, step, parent_id, is_value_displayed, step_mappings){
  var range = document.createElement('INPUT');
  range.setAttribute('type', 'range');
  range.setAttribute('min', min);
  range.setAttribute('max', max);
  range.setAttribute('step', step);
  range.setAttribute('id', id);
  
  var data_list_id = 'steplist' + current_range_number;
  range.setAttribute('list', data_list_id);
  
  var data_list = document.createElement('DATALIST');
  data_list.setAttribute('id', data_list_id);
  
  
  for (var value = parseInt(min); value <= parseInt(max); value += parseInt(step)){
    var option = document.createElement('OPTION');
    option.value = value;
    data_list.appendChild(option);
  }
  
  var range_container = range;
  
  if (is_value_displayed){
    var container = document.createElement('DIV');
    var value_label = document.createElement('SPAN');
    var value_label_id = 'value' + current_range_number;
    value_label.setAttribute('id', value_label_id);

    var text = step_mappings ?
      step_mappings[range.value] :
      range.value;

    value_label.innerHTML = text;
    
    $(document).on('input change', '#' + id, {
      range_id: id,
      value_id: value_label_id,
      step_mappings: step_mappings
    }, function(event){
      var updated_range = document.getElementById(event.data.range_id);
      var target_value = document.getElementById(event.data.value_id);

      var label_text = event.data.step_mappings ?
        event.data.step_mappings[updated_range.value] :
        updated_range.value;

      target_value.innerHTML = label_text;
    });
    
    container.appendChild(range);
    container.appendChild(value_label);
    range_container = container;
  }
  
  var parent = document.getElementById(parent_id);
  parent.appendChild(range_container);
  parent.appendChild(data_list);
  parent.appendChild(document.createElement('BR'));
  
  current_range_number += 1;
}