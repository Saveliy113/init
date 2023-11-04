import React, { memo } from 'react';
import Task from '../task/Task';

const InnerList = memo(({ tasks }) => {
  return tasks.map((task, index) => (
    <Task key={task.id} task={task} index={index} />
  ));
});

export default InnerList;
