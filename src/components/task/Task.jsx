import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { styled } from 'styled-components';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.isdragging ? 'lightgreen' : 'white')};
  display: flex;
`;

const Handle = styled.div`
  width: 20px;
  height: 20px;
  background-color: orange;
  border-radius: 4px;
  margin-right: 8px;
`;

const Task = ({ task, index }) => {
  console.log(task);
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          ref={provided.innerRef}
          isdragging={snapshot.isDragging}
        >
          <Handle {...provided.dragHandleProps} />
          {task.content}
        </Container>
      )}
    </Draggable>
  );
};

export default Task;
