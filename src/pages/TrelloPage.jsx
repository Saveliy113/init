import React, { useEffect, useRef, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import initialData from '../assets/trelloData';
import Column from '../components/column/Column';
import { XCircle } from 'lucide-react';
import styles from './trello.module.scss';

const TrelloPage = () => {
  const [data, setData] = useState(initialData);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [columnTitle, setColumnTitle] = useState('');
  const columnCreateInputRef = useRef(null);

  useEffect(() => {
    if (isCreatingColumn) {
      columnCreateInputRef.current.focus();
    }
  }, [isCreatingColumn]);

  const onDragEnd = (result) => {
    document.body.style.color = 'inherit';
    document.body.style.backgroundColor = 'inherit';
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'column') {
      const newColumnOrder = Array.from(data.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...data,
        columnOrder: newColumnOrder,
      };

      setData(newState);
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newState);
      return;
    }

    //Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setData(newState);
    return;
  };

  const addNewColumn = (columnTitle) => {
    const columnId = `column-${data.columnOrder.length + 1}`;
    const newColumnData = {
      ...data,
      columns: {
        ...data.columns,
        [columnId]: {
          id: columnId,
          title: columnTitle,
          taskIds: [],
        },
      },
      columnOrder: [...data.columnOrder, columnId],
    };

    setData(newColumnData);
    console.log(newColumnData);
  };

  const renameColumn = (columnId, newColumnTitle) => {
    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],
          title: newColumnTitle,
        },
      },
    };
    console.log('NEW DATA', newData);

    setData(newData);
  };

  const deleteColumn = (columnId) => {
    console.log(columnId);
    const updatedTasks = { ...data.tasks };
    const updatedColumns = { ...data.columns };
    const updatedColumnOrder = data.columnOrder.filter(
      (column) => column !== columnId
    );

    data.columns[columnId].taskIds.forEach((taskId) => {
      delete updatedTasks[taskId];
    });

    delete updatedColumns[columnId];

    setData({
      tasks: updatedTasks,
      columns: updatedColumns,
      columnOrder: updatedColumnOrder,
    });
  };

  const addTaskToColumn = (columnId, taskText) => {
    console.log(columnId, taskText);
    const taskId = `task-${Object.keys(data.tasks).length + 1}`;

    const newTask = {
      id: taskId,
      content: taskText,
    };

    const updatedTasks = { ...data.tasks };
    updatedTasks[taskId] = newTask;

    const updatedColumns = { ...data.columns };
    updatedColumns[columnId].taskIds.push(taskId);

    setData({
      ...data,
      tasks: updatedTasks,
      columns: updatedColumns,
    });
  };

  return (
    <div className="p-5 flex">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="allColumns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              className="flex gap-5"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {data.columnOrder.map((columnId, index) => {
                const column = data.columns[columnId];
                const tasks = column.taskIds.map(
                  (taskId) => data.tasks[taskId]
                );

                return (
                  <Column
                    key={column.id}
                    column={column}
                    tasks={tasks}
                    index={index}
                    renameColumn={renameColumn}
                    deleteColumn={deleteColumn}
                    addTaskToColumn={addTaskToColumn}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {isCreatingColumn ? (
        <div className={styles.cardCreatingWrapper}>
          <button
            className={styles.creatingCloseBtn}
            onClick={() => setIsCreatingColumn(false)}
          >
            <XCircle />
          </button>
          <input
            type="text"
            value={columnTitle}
            ref={columnCreateInputRef}
            onChange={(e) => setColumnTitle(e.target.value)}
            onBlur={() => {
              setIsCreatingColumn(false);
              setColumnTitle('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && columnTitle) {
                addNewColumn(columnTitle);
                setColumnTitle('');
                setIsCreatingColumn(false);
              }
            }}
          />
          <button
            className={styles.createColumnBtn}
            onClick={() => {
              addNewColumn(columnTitle);
              setIsCreatingColumn(false);
            }}
            disabled={!columnTitle}
          >
            Добавить список
          </button>
        </div>
      ) : (
        <button
          className={styles.addNewColumnBtn}
          onClick={() => setIsCreatingColumn(!isCreatingColumn)}
        >
          <span>+</span> Добавить еще одну колонку
        </button>
      )}
    </div>
  );
};

export default TrelloPage;
