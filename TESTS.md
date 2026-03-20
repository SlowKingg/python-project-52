## Общие концепции

**`TestCase`** — базовый Django-класс для тестов. Каждый тест запускается в
транзакции, которая откатывается после его завершения — БД всегда чистая.

**`setUpTestData(cls)`** — создаёт данные **один раз** для всего класса (не
перед каждым тестом). Быстрее `setUp`, подходит для данных, которые тесты не
изменяют.

**`self.client`** — встроенный тестовый HTTP-клиент Django. Позволяет делать
GET/POST-запросы к view без реального сервера.

**`follow=True`** — автоматически идёт по редиректам до финального ответа.

---

## `task_manager/tests.py` — Login / Logout

### `BaseAuthViewTests`

Создаёт одного пользователя `john` для всех auth-тестов.

---

### `LoginPageViewTests.test_adds_success_message_after_login`

```python
response = self.client.post(reverse("login"),
                            {"username": "john", "password": "..."},
                            follow=True)

self.assertRedirects(response, reverse("index"))
self.assertIn(_("You are logged in"), messages)
```

**Что тестируем:** нашу кастомную `LoginPageView.form_valid()`, которая
добавляет `messages.success`.

Django из коробки не добавляет flash-сообщение при входе — мы добавили это сами.
Тест проверяет:

- после входа происходит редирект на главную страницу
- в очереди сообщений есть нужный текст

---

### `LogoutPageViewTests.test_adds_success_message_for_authenticated_user`

```python
self.client.login(...)
response = self.client.post(reverse("logout"), follow=True)

self.assertRedirects(response, reverse("index"))
self.assertIn(_("You are logged out"), messages)
```

**Что тестируем:** нашу кастомную `LogoutPageView.dispatch()`.

Мы вручную сохранили флаг `was_authenticated` до вызова `super().dispatch()`,
потому что после logout сессия очищается и `request.user` уже анонимный. Тест
проверяет, что сообщение всё равно появляется.

---

## `task_manager/tasks/tests.py` — Tasks

### `BaseTaskViewTests`

Создаёт двух пользователей (`author`, `other`) и один статус. Используется во
всех трёх test-классах задач.

---

### `TaskCreateViewTests.test_sets_author_from_request_user`

```python
self.client.login(username="author", ...)
response = self.client.post(reverse("tasks_create"), {...})

task = Task.objects.get(name="New task")
self.assertEqual(task.author, self.author)
```

**Что тестируем:** строку `form.instance.author = self.request.user` в
`TaskCreateView.form_valid()`.

Форма не содержит поле `author` — оно подставляется из сессии. Тест проверяет,
что задача действительно создалась с правильным автором, а не пустым полем.

---

### `TaskDeleteViewTests.test_denies_delete_for_non_author`

```python
# Задачу создаёт author, но удалить пытается other
self.client.login(username="other", ...)
response = self.client.post(reverse("tasks_delete", args=[task.pk]),
                            follow=True)

self.assertTrue(Task.objects.filter(pk=task.pk).exists())  # задача не удалена
self.assertIn(_("A task can only be deleted by its author"), messages)
```

**Что тестируем:** `TaskAuthorOnlyMixin.handle_no_permission()` в
`task_manager/tasks/mixins.py`.

Проверяем сразу три вещи: редирект на список задач, задача осталась в БД,
появилось error-сообщение.

---

### `TaskListViewTests.test_self_tasks_filter_shows_only_own_tasks`

```python
# Создаём свою задачу и чужую
response = self.client.get(reverse("tasks_index"), {"self_tasks": "on"})

tasks = list(response.context["tasks"])
self.assertEqual(tasks, [own_task])  # только своя
```

**Что тестируем:** метод `filter_self_tasks()` в `TaskFilterSet` (
`tasks/filters.py`).

Передаём в GET-параметре `self_tasks=on` и проверяем, что в контексте шаблона
оказалась только задача текущего пользователя, а чужая отфильтрована.

---

## `task_manager/statuses/tests.py` — Statuses

### `StatusDeleteViewTests.test_shows_error_when_status_is_protected`

```python
# Создаём статус и задачу, которая на него ссылается
self.client.login(...)
response = self.client.post(reverse("statuses_delete", args=[status.pk]),
                            follow=True)

self.assertTrue(
    Status.objects.filter(pk=status.pk).exists())  # статус не удалён
self.assertIn(_("Cannot delete status"), messages)
```

**Что тестируем:** блок `except ProtectedError` в
`StatusDeleteView.form_valid()`.

Поле `status` в модели `Task` задано с `on_delete=PROTECT`, поэтому Django
бросает `ProtectedError`. Мы его перехватываем и показываем сообщение вместо
падения с 500-ошибкой. Тест проверяет, что именно это и происходит.

---

## `task_manager/labels/tests.py` — Labels

### `LabelDeleteViewTests.test_shows_error_when_label_is_linked_to_task`

```python
# Метка прикреплена к задаче через ManyToMany
task.labels.add(label)

response = self.client.post(reverse("labels_delete", args=[label.pk]),
                            follow=True)

self.assertTrue(Label.objects.filter(pk=label.pk).exists())  # метка не удалена
self.assertIn(_("Cannot delete label"), messages)
```

**Что тестируем:** проверку `if self.object.tasks.exists()` в
`LabelDeleteView.form_valid()`.

Метки связаны с задачами через ManyToMany, поэтому `on_delete=PROTECT` тут не
работает — мы написали явную проверку руками. Тест убеждается, что метка не
удаляется, когда она используется.

---

## `task_manager/users/tests.py` — Users

### `BaseUserViewTests`

Создаёт двух пользователей: `alice` (владелец) и `bob` (другой).

---

### `UserUpdateViewTests.test_forbids_update_for_another_user`

```python
# alice пытается открыть страницу редактирования bob-а
self.client.login(username="alice", ...)
response = self.client.get(reverse("users_update", args=[self.other_user.pk]),
                           follow=True)

self.assertRedirects(response, reverse("users_index"))
self.assertIn(_("You do not have permission to update another user."), messages)
```

**Что тестируем:** `CurrentUserOnlyMixin.handle_no_permission()` в
`users/mixins.py`.

Проверяем, что пользователь не может попасть на страницу редактирования чужого
профиля — получает редирект и сообщение об ошибке.

---

### `UserDeleteViewTests.test_shows_error_when_user_is_protected`

```python
# alice — автор задачи, которая ссылается на неё через on_delete=PROTECT
response = self.client.post(reverse("users_delete", args=[self.user.pk]),
                            follow=True)

self.assertTrue(
    User.objects.filter(pk=self.user.pk).exists())  # пользователь не удалён
self.assertIn(_("Cannot delete user"), messages)
```

**Что тестируем:** блок `except ProtectedError` в `UserDeleteView.form_valid()`.

Пользователь является автором задачи (`on_delete=PROTECT`), поэтому Django
запрещает удаление. Мы перехватываем ошибку и выводим сообщение. Тест проверяет,
что пользователь остался в БД и сообщение появилось.
