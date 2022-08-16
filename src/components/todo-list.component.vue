<template>
  <a-divider />
  <div class="planned-block ">
    <b>Planned</b>
    <a-button @click="completeAllTodos">Complete All</a-button>
  </div>
  <a-list item-layout="horizontal" :data-source="store.plannedTodos">
    <template #renderItem="{ item }">
      <TodoItem
        :key="item.id"
        :id="item.id"
        :description="item.description"
        :completed="item.completed"
        @toggle-todo="toggleTodo"
        @delete-todo="deleteTodo"
      />
    </template>
  </a-list>
  <a-divider />
  <div class="planned-block ">
    <b>Completed</b>
    <a-button danger @click="clearAllTodos">Clear All</a-button>
  </div>
   <a-list item-layout="horizontal" :data-source="store.completedTodos">
    <template #renderItem="{ item }">
      <TodoItem
        :key="item.id"
        :id="item.id"
        :description="item.description"
        :completed="item.completed"
        @toggle-todo="toggleTodo"
        @delete-todo="deleteTodo"
      />
    </template>
  </a-list>
</template>

<script setup>
import { onMounted } from '@vue/runtime-core';
import TodoItem from '@/components/todo-item.component';
import { todoStore } from '@/store/todo.store';
const store = todoStore();

function toggleTodo(todoID) {
  store.value.toggleTodo(todoID);
}

function completeAllTodos() {
  store.value.completeAllTodos();
}

function deleteTodo(todoID) {
  store.value.removeTodo(todoID);
}

function clearAllTodos() {
  store.value.clearCompletedTodos();
}

onMounted(() => {
  store.value.getTodos();
});

</script>

<style>
  .planned-block, .completed-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>