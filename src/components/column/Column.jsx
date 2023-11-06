import React, { useEffect, useRef, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import InnerList from '../innerList/InnerList';
import { Pencil, PlusIcon, Save, Trash2Icon } from 'lucide-react';
import styles from './Column.module.scss';

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
        <div
          className="w-[300px] h-full p-2 flex flex-col border border-gray-300 rounded-xl bg-gray-100"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="flex items-center text-cyan-900 font-bold">
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
              <h3 className="w-full p-2" {...provided.dragHandleProps}>
                {column.title}
              </h3>
            )}

            <div className="flex gap-1">
              <button
                className="flex justify-center items-center cursor-pointer p-1 rounded-lg border border-transparent outline-none bg-transparent overflow-hidden transition duration-200 ease-in hover:bg-gray-200"
                onClick={() => toggleEditing(column.id)}
              >
                {isEditing ? <Save /> : <Pencil />}{' '}
              </button>
              <button
                className="flex justify-center items-center cursor-pointer p-1 rounded-lg border border-transparent outline-none bg-transparent overflow-hidden transition duration-200 ease-in hover:bg-gray-200"
                onClick={() => deleteColumn(column.id)}
              >
                <Trash2Icon className="stroke-cyan-900" />
              </button>
            </div>
          </div>
          <Droppable droppableId={column.id} type="task">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                isdraggingover={snapshot.isDraggingOver}
                className={`py-2 h-full mb-2 rounded-md ${
                  snapshot.isDraggingOver ? 'bg-gray-200' : ''
                }`}
              >
                <InnerList tasks={tasks} />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div className="w-full">
            {isCreating && (
              <textarea
                ref={textAreaRef}
                placeholder="Ввести заголовок для этой карточки"
                style={{ resize: 'none' }}
                className="px-3 py-2 rounded-md w-full min-h-[76px] resize-y border-transparent outline-none shadow-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') createTask(column.id);
                }}
              />
            )}
            <button
              className={`flex gap-1 px-3 py-1.5 rounded-md ${
                isCreating ? 'bg-blue-600 text-white hover:bg-blue-800' : ''
              } hover:bg-gray-200 text-cyan-900 font-semibold transition duration-200`}
              onClick={() => {
                createTask(column.id);
              }}
            >
              {isCreating ? (
                'Добавить карточку'
              ) : (
                <>
                  <PlusIcon className="stroke-cyan-900" />
                  Добавить карточку
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};
export default Column;
