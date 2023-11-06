import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Task = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
          isdragging={snapshot.isDragging}
          className={`flex ${
            snapshot.isDragging ? 'opacity-75' : 'opacity-100'
          } bg-white p-2 mb-2 rounded-lg shadow-sm text-cyan-900`}
        >
          {task.content}
        </div>
      )}
    </Draggable>
  );
};

export default Task;
