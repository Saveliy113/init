import React, { forwardRef, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import InnerList from '../innerList/InnerList';
import styles from './Column.module.scss';
import {
  MoreHorizontal,
  Pencil,
  Plus,
  PlusIcon,
  Save,
  Trash2,
  Trash2Icon,
} from 'lucide-react';

const Container = styled.div`
  width: 300px;
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 8px;
  background-color: white;

  display: flex;
  flex-direction: column;
  height: 100%;
`;
const Title = styled.h3`
  width: 100%;
  padding: 8px;
`;
const TaskList = styled.div`
  border: 1px solid red;
  height: 100%;
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) =>
    props.isdraggingover ? 'skyblue' : 'inherit'};
`;

const Column = ({
  column,
  tasks,
  index,
  renameColumn,
  deleteColumn,
  addTaskToColumn,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef(null);
  const textAreaRef = useRef(null);

  const toggleEditing = (columnId) => {
    console.log(columnId);
    if (!isEditing) {
      setIsEditing(!isEditing);
    }

    if (isEditing && inputRef.current.value) {
      renameColumn(columnId, inputRef.current.value);
      setIsEditing(!isEditing);
    }
  };

  const createTask = (columnId) => {
    if (!isCreating) {
      setIsCreating(!isCreating);
    }
    if (isCreating && textAreaRef.current.value) {
      setIsCreating(!isCreating);
      addTaskToColumn(columnId, textAreaRef.current.value);
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current.value = column.title;
      inputRef.current.focus();
    } else if (isCreating) {
      textAreaRef.current.value = '';
      textAreaRef.current.focus();
    }
  }, [isEditing, isCreating]);

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <Container {...provided.draggableProps} ref={provided.innerRef}>
          <div className={styles.columnActions}>
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    toggleEditing(column.id);
                  }
                }}
              />
            ) : (
              <Title {...provided.dragHandleProps}>{column.title}</Title>
            )}

            <div className={styles.btnsWrapper}>
              <button
                className={styles.columnsEditBtn}
                onClick={() => toggleEditing(column.id)}
              >
                {isEditing ? <Save /> : <Pencil />}{' '}
              </button>
              <button
                className={styles.deleteColumnBtn}
                onClick={() => deleteColumn(column.id)}
              >
                <Trash2Icon />
              </button>
            </div>
          </div>
          <Droppable droppableId={column.id} type="task">
            {(provided, snapshot) => (
              <TaskList
                {...provided.droppableProps}
                ref={provided.innerRef}
                isdraggingover={snapshot.isDraggingOver}
              >
                <InnerList tasks={tasks} />
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
          <div className={styles.footerBtns}>
            {isCreating && (
              <textarea
                ref={textAreaRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') createTask(column.id);
                }}
              />
            )}
            <button
              className={styles.addColumnItemBtn}
              onClick={() => {
                createTask(column.id);
              }}
            >
              {isCreating ? <Save /> : <PlusIcon />}
            </button>
          </div>
        </Container>
      )}
    </Draggable>
  );
};
export default Column;
