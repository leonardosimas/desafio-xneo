<?php

// Conexão com o banco de dados
$host = '35.226.146.116';
$db = 'ailton-leonardo-silva';
$user = 'ailton-leonardo-silva';
$password = 'wtAaWqkR8qWkdIa5nuMj';

try {
  $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  die('Erro na conexão com o banco de dados: ' . $e->getMessage());
}

// Ler todas as tarefas
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $stmt = $pdo->prepare('SELECT * FROM todo_list');
  $stmt->execute();
  $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($tasks);
  exit();
}

// Inserir uma nova tarefa
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $description = $_POST['description'];
  $completed = 0;

  $stmt = $pdo->prepare('INSERT INTO todo_list (description, completed) VALUES (:description, :completed)');
  $stmt->bindParam(':description', $description, PDO::PARAM_STR);
  $stmt->bindParam(':completed', $completed, PDO::PARAM_INT);
  $stmt->execute();

  $taskId = $pdo->lastInsertId();
  $task = array('id' => $taskId, 'description' => $description, 'completed' => $completed);
  echo json_encode($task);
  exit();
}

// Atualizar uma tarefa como completada
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  parse_str(file_get_contents('php://input'), $_PUT);
  $taskId = $_PUT['id'];
  $completed = $_PUT['completed'];

  $stmt = $pdo->prepare('UPDATE todo_list SET completed = :completed WHERE id = :id');
  $stmt->bindParam(':completed', $completed, PDO::PARAM_INT);
  $stmt->bindParam(':id', $taskId, PDO::PARAM_INT);
  $stmt->execute();
  exit();
}

// Excluir uma tarefa
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  parse_str(file_get_contents('php://input'), $_DELETE);
  $taskId = $_DELETE['id'];

  $stmt = $pdo->prepare('DELETE FROM todo_list WHERE id = :id');
  $stmt->bindParam(':id', $taskId, PDO::PARAM_INT);
  $stmt->execute();
  exit();
}
