import os
from base64 import urlsafe_b64encode

from datetime import date, timedelta
from decimal import Decimal
from time import sleep
from subprocess import DEVNULL, Popen

from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.core.servers.basehttp import ThreadedWSGIServer
from django.test import override_settings, LiveServerTestCase
from django.test.testcases import LiveServerThread, QuietWSGIRequestHandler
from rest_authtoken.models import AuthToken
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select

from task.models import Task, TaskChunk


@override_settings(STATIC_ROOT='nonexistent', STATIC_URL='nonexistent')
class SeleniumTest(LiveServerTestCase):
    host = '127.0.0.1'
    port = 8000
    frontend_port = 8080

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        cls.selenium = webdriver.Chrome(options=options)
        cls.selenium.implicitly_wait(10)

        cls._frontend_server = Popen([
            'python',
            '-m', 'http.server',
            str(cls.frontend_port),
        ], cwd=os.environ.get('DIST_DIR'), stdout=DEVNULL, stderr=DEVNULL)
        sleep(0.2)
        cls.frontend_url = 'http://127.0.0.1:{}'.format(cls.frontend_port)

    @classmethod
    def tearDownClass(cls):
        cls.selenium.quit()
        cls._frontend_server.kill()
        super().tearDownClass()

    class ReusableLiveServerThread(LiveServerThread):
        def _create_server(self):
            return ThreadedWSGIServer(
                (self.host, self.port),
                QuietWSGIRequestHandler,
                allow_reuse_address=True
            )

    server_thread_class = ReusableLiveServerThread


class LoginPageTest(SeleniumTest):
    """
    Test the login page.
    """
    def test_login(self):
        user = get_user_model().objects.create(
            username='admin',
            email='admin@localhost',
            workhours_weekday=Decimal(8),
            workhours_weekend=Decimal(4))
        user.set_password('foobar123')
        user.save()

        self.selenium.get(self.frontend_url)
        sleep(0.5)

        # hash-location is #/login now
        self.assertIn(
            'login',
            self.selenium.current_url)

        username_input = self.selenium.find_element_by_xpath(
            '//input[@placeholder="Username"]')
        username_input.send_keys('admin')
        password_input = self.selenium.find_element_by_xpath(
            '//input[@placeholder="Password"]')
        password_input.send_keys('foobar123')
        login_button = self.selenium.find_element_by_xpath(
            '//input[@value="Login"]')
        login_button.click()
        sleep(0.5)

        self.assertNotIn(
            'login',
            self.selenium.current_url)

        self.assertIn(
            'New Task',
            self.selenium.find_element_by_tag_name('body').text)


class AuthenticatedSeleniumTest(SeleniumTest):
    def setUp(self):
        self.user = get_user_model().objects.create(
            username='admin',
            email='admin@localhost',
            workhours_weekday=Decimal(8),
            workhours_weekend=Decimal(4))

        self.selenium.get(self.frontend_url)
        sleep(0.2)
        token = urlsafe_b64encode(AuthToken.create_token_for_user(self.user)).decode()
        self.selenium.execute_script(
            'window.localStorage.setItem("authToken", "{}")'.format(token))


class OverviewTest(AuthenticatedSeleniumTest):
    def test_new_task(self):
        self.assertEqual(Task.objects.count(), 0)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        new_task_link = self.selenium.find_element_by_link_text('New Task')
        new_task_link.click()
        sleep(0.1)
        name_input = self.selenium.find_element_by_xpath(
            '//input[@placeholder="Name"]')
        name_input.send_keys('Testtask')
        duration_input = self.selenium.find_element_by_xpath(
            '//input[@placeholder="Duration"]')
        duration_input.clear()
        duration_input.send_keys('42.2')
        self.selenium.find_element_by_xpath('//button[contains(text(), "Create Task")]').click()
        sleep(0.5)

        self.assertEqual(Task.objects.count(), 1)
        task = Task.objects.first()
        self.assertEqual(task.name, 'Testtask')
        self.assertEqual(task.duration, Decimal('42.2'))
        self.assertEqual(task.start, None)

    def test_new_task_submit_with_enter_duration(self):
        self.assertEqual(Task.objects.count(), 0)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        new_task_link = self.selenium.find_element_by_link_text('New Task')
        new_task_link.click()
        sleep(0.1)
        name_input = self.selenium.find_element_by_xpath(
            '//input[@placeholder="Name"]')
        name_input.send_keys('Testtask')
        duration_input = self.selenium.find_element_by_xpath(
            '//input[@placeholder="Duration"]')
        duration_input.clear()
        duration_input.send_keys('42.2')
        duration_input.send_keys(Keys.ENTER)
        sleep(0.5)

        self.assertEqual(Task.objects.count(), 1)
        task = Task.objects.first()
        self.assertEqual(task.name, 'Testtask')
        self.assertEqual(task.duration, Decimal('42.2'))
        self.assertEqual(task.start, None)

    def test_new_task_submit_with_enter_name(self):
        self.assertEqual(Task.objects.count(), 0)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        new_task_link = self.selenium.find_element_by_link_text('New Task')
        new_task_link.click()
        sleep(0.1)
        name_input = self.selenium.find_element_by_xpath(
            '//input[@placeholder="Name"]')
        name_input.send_keys('Testtask')
        duration_input = self.selenium.find_element_by_xpath(
            '//input[@placeholder="Duration"]')
        duration_input.clear()
        duration_input.send_keys('42.2')
        name_input.send_keys(Keys.ENTER)
        sleep(0.5)

        self.assertEqual(Task.objects.count(), 1)
        task = Task.objects.first()
        self.assertEqual(task.name, 'Testtask')
        self.assertEqual(task.duration, Decimal('42.2'))
        self.assertEqual(task.start, None)

    def test_new_task_scheduling_today(self):
        """Test creating a new task and instantly scheduling it."""
        self.assertEqual(Task.objects.count(), 0)
        self.assertEqual(TaskChunk.objects.count(), 0)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        new_task_link = self.selenium.find_element_by_link_text('New Task')
        new_task_link.click()
        sleep(0.1)
        name_input = self.selenium.find_element_by_xpath(
            '//input[@placeholder="Name"]')
        name_input.send_keys('Testtask')
        duration_input = self.selenium.find_element_by_xpath(
            '//input[@placeholder="Duration"]')
        duration_input.clear()
        duration_input.send_keys('42.2')
        schedule_checkbox = self.selenium.find_element_by_class_name('form-switch')
        schedule_checkbox.click()
        self.selenium.find_element_by_xpath('//button[contains(text(), "Create Task")]').click()
        sleep(0.5)

        self.assertEqual(Task.objects.count(), 1)
        task = Task.objects.first()
        self.assertEqual(task.name, 'Testtask')
        self.assertEqual(task.duration, Decimal('42.2'))
        self.assertEqual(task.start, None)

        self.assertEqual(TaskChunk.objects.count(), 1)
        chunk = TaskChunk.objects.first()
        self.assertEqual(chunk.task, task)
        self.assertEqual(chunk.day, date.today())

    def test_new_task_scheduling_tomorrow(self):
        """Test creating a new task and instantly scheduling it."""
        self.assertEqual(Task.objects.count(), 0)
        self.assertEqual(TaskChunk.objects.count(), 0)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        new_task_link = self.selenium.find_element_by_link_text('New Task')
        new_task_link.click()
        sleep(0.1)
        name_input = self.selenium.find_element_by_xpath(
            '//input[@placeholder="Name"]')
        name_input.send_keys('Testtask')
        duration_input = self.selenium.find_element_by_xpath(
            '//input[@placeholder="Duration"]')
        duration_input.clear()
        duration_input.send_keys('42.2')
        schedule_checkbox = self.selenium.find_element_by_class_name('form-switch')
        schedule_checkbox.click()
        schedule_for = self.selenium.find_element_by_xpath('//div[contains(@class, "modal-body")]//select')
        Select(schedule_for).select_by_visible_text(
            'Tomorrow')
        self.selenium.find_element_by_xpath('//button[contains(text(), "Create Task")]').click()
        sleep(0.5)

        self.assertEqual(Task.objects.count(), 1)
        task = Task.objects.first()
        self.assertEqual(task.name, 'Testtask')
        self.assertEqual(task.duration, Decimal('42.2'))
        self.assertEqual(task.start, None)

        self.assertEqual(TaskChunk.objects.count(), 1)
        chunk = TaskChunk.objects.first()
        self.assertEqual(chunk.task, task)
        self.assertEqual(chunk.day, date.today() + timedelta(days=1))

    def test_new_task_invalid_duration(self):
        self.assertEqual(Task.objects.count(), 0)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        new_task_link = self.selenium.find_element_by_link_text('New Task')
        new_task_link.click()
        sleep(0.1)
        name_input = self.selenium.find_element_by_xpath(
            '//input[@placeholder="Name"]')
        name_input.send_keys('Testtask')
        duration_input = self.selenium.find_element_by_xpath(
            '//input[@placeholder="Duration"]')
        duration_input.clear()
        duration_input.send_keys('-42.2')
        self.selenium.find_element_by_xpath('//button[contains(text(), "Create Task")]').click()
        sleep(0.5)

        self.assertIn(
            'is-error',
            duration_input.get_attribute('class'))
        self.assertEqual(Task.objects.count(), 0)

    def test_new_task_with_start_date(self):
        self.assertEqual(Task.objects.count(), 0)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        new_task_link = self.selenium.find_element_by_link_text('New Task')
        new_task_link.click()
        sleep(0.1)
        name_input = self.selenium.find_element_by_xpath(
            '//input[@placeholder="Name"]')
        name_input.send_keys('Testtask')
        duration_input = self.selenium.find_element_by_xpath(
            '//input[@placeholder="Duration"]')
        duration_input.clear()
        duration_input.send_keys('42.2')
        start_input = self.selenium.find_element_by_xpath('//input[@type="date" and @placeholder="Start"]')
        start_input.send_keys('05/02/2018')
        self.selenium.find_element_by_xpath('//button[contains(text(), "Create Task")]').click()
        sleep(0.5)

        self.assertEqual(Task.objects.count(), 1)
        task = Task.objects.first()
        self.assertEqual(task.name, 'Testtask')
        self.assertEqual(task.duration, Decimal('42.2'))
        self.assertEqual(task.start, date(2018, 5, 2))

    def test_edit_task_duration_too_low(self):
        """
        Test that it is not possible to set the total duration of a task
        to a value lower than the duration that is already scheduled.
        """
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)
        TaskChunk.objects.create(
            day=date.today(),
            task=task,
            duration=2,
            day_order=0)
        TaskChunk.objects.create(
            day=date.today(),
            task=task,
            duration=1,
            day_order=0,
            finished=True)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        edit_task_link = self.selenium.find_elements_by_xpath('//a[@data-tooltip="Edit task"]')[0]
        edit_task_link.click()
        sleep(0.1)
        scheduled_display = self.selenium.find_element_by_xpath('//div[@class="content"]/p')
        self.assertIn(
            'Scheduled: 3h',
            scheduled_display.get_attribute('innerHTML'))
        self.assertIn(
            '1h finished',
            scheduled_display.get_attribute('innerHTML'))
        duration_input = self.selenium.find_element_by_xpath('//div[@class="content"]//input[@placeholder="Duration"]')
        duration_input.clear()
        duration_input.send_keys('1')  # invalid, 3 hours are already scheduled
        self.selenium.find_element_by_xpath('//button[contains(text(), "Update Task")]').click()
        sleep(0.5)

        self.assertIn(
            'is-error',
            duration_input.get_attribute('class'))

        task.refresh_from_db()
        # the duration was not changed
        self.assertEqual(
            task.duration,
            Decimal(5))

    def test_edit_task_duration_incomplete(self):
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)
        TaskChunk.objects.create(
            day=date.today(),
            task=task,
            duration=2,
            day_order=0)
        TaskChunk.objects.create(
            day=date.today(),
            task=task,
            duration=1,
            day_order=0,
            finished=True)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        edit_task_link = self.selenium.find_elements_by_xpath('//a[@data-tooltip="Edit task"]')[0]
        edit_task_link.click()
        sleep(0.1)
        scheduled_display = self.selenium.find_element_by_xpath('//div[@class="content"]/p')
        self.assertIn(
            'Scheduled: 3h',
            scheduled_display.get_attribute('innerHTML'))
        self.assertIn(
            '1h finished',
            scheduled_display.get_attribute('innerHTML'))
        duration_input = self.selenium.find_element_by_xpath('//div[@class="content"]//input[@placeholder="Duration"]')
        duration_input.clear()
        duration_input.send_keys('42')
        self.selenium.find_element_by_xpath('//button[contains(text(), "Update Task")]').click()
        sleep(0.5)

        task.refresh_from_db()
        self.assertEqual(
            task.name,
            'Testtask')
        self.assertEqual(
            task.duration,
            Decimal(42))

    def test_edit_task_name_incomplete(self):
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)
        TaskChunk.objects.create(
            day=date.today(),
            task=task,
            duration=2,
            day_order=0)
        TaskChunk.objects.create(
            day=date.today(),
            task=task,
            duration=1,
            day_order=0,
            finished=True)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        edit_task_link = self.selenium.find_elements_by_xpath('//a[@data-tooltip="Edit task"]')[0]
        edit_task_link.click()
        sleep(0.1)
        scheduled_display = self.selenium.find_element_by_xpath('//div[@class="content"]/p')
        self.assertIn(
            'Scheduled: 3h',
            scheduled_display.get_attribute('innerHTML'))
        self.assertIn(
            '1h finished',
            scheduled_display.get_attribute('innerHTML'))
        name_input = self.selenium.find_element_by_xpath('//div[@class="content"]//input[@placeholder="Name"]')
        name_input.clear()
        name_input.send_keys('Edited Task')
        self.selenium.find_element_by_xpath('//button[contains(text(), "Update Task")]').click()
        sleep(0.5)

        task.refresh_from_db()
        self.assertEqual(
            task.name,
            'Edited Task')
        self.assertEqual(
            task.duration,
            Decimal(5))

    def test_edit_task_name_duration_incomplete(self):
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)
        TaskChunk.objects.create(
            day=date.today(),
            task=task,
            duration=2,
            day_order=0)
        TaskChunk.objects.create(
            day=date.today(),
            task=task,
            duration=1,
            day_order=0,
            finished=True)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        edit_task_link = self.selenium.find_elements_by_xpath('//a[@data-tooltip="Edit task"]')[0]
        edit_task_link.click()
        sleep(0.1)
        scheduled_display = self.selenium.find_element_by_xpath('//div[@class="content"]/p')
        self.assertIn(
            'Scheduled: 3h',
            scheduled_display.get_attribute('innerHTML'))
        self.assertIn(
            '1h finished',
            scheduled_display.get_attribute('innerHTML'))
        name_input = self.selenium.find_element_by_xpath('//div[@class="content"]//input[@placeholder="Name"]')
        name_input.clear()
        name_input.send_keys('Edited Task')
        duration_input = self.selenium.find_element_by_xpath('//div[@class="content"]//input[@placeholder="Duration"]')
        duration_input.clear()
        duration_input.send_keys('42')
        self.selenium.find_element_by_xpath('//button[contains(text(), "Update Task")]').click()
        sleep(0.5)

        task.refresh_from_db()
        self.assertEqual(
            task.name,
            'Edited Task')
        self.assertEqual(
            task.duration,
            Decimal(42))

    def test_edit_task_start_incomplete(self):
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)
        TaskChunk.objects.create(
            day=date.today(),
            task=task,
            duration=2,
            day_order=0)
        TaskChunk.objects.create(
            day=date.today(),
            task=task,
            duration=1,
            day_order=0,
            finished=True)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        edit_task_link = self.selenium.find_elements_by_xpath('//a[@data-tooltip="Edit task"]')[0]
        edit_task_link.click()
        sleep(0.1)
        scheduled_display = self.selenium.find_element_by_xpath('//div[@class="content"]/p')
        self.assertIn(
            'Scheduled: 3h',
            scheduled_display.get_attribute('innerHTML'))
        self.assertIn(
            '1h finished',
            scheduled_display.get_attribute('innerHTML'))
        start_input = self.selenium.find_element_by_xpath('//input[@type="date" and @placeholder="Start"]')
        start_input.send_keys('05/02/2018')
        self.selenium.find_element_by_xpath('//button[contains(text(), "Update Task")]').click()
        sleep(0.5)

        task.refresh_from_db()
        self.assertEqual(
            task.name,
            'Testtask')
        self.assertEqual(
            task.duration,
            Decimal(5))
        self.assertEqual(
            task.start,
            date(2018, 5, 2))

    def test_schedule_task_for_today(self):
        self.assertEqual(TaskChunk.objects.count(), 0)

        # create dummy task
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        schedule_link = self.selenium.find_element_by_xpath('//a[@data-tooltip="Schedule"]')
        schedule_link.click()
        sleep(0.1)
        modal_body = self.selenium.find_element_by_xpath('//div[contains(@class, "modal-body")]')
        self.assertIn(
            'Testtask',
            modal_body.get_attribute('innerHTML'))
        self.assertIn(
            '5h',
            modal_body.get_attribute('innerHTML'))
        duration_input = self.selenium.find_element_by_xpath(
            '//div[contains(@class, "modal-body")]//input[@placeholder="Duration"]')
        duration_input.clear()
        duration_input.send_keys('1')
        self.selenium.find_element_by_xpath('//input[@value="Schedule"]').click()
        sleep(0.5)

        self.assertEqual(task.chunks.count(), 1)
        chunk = task.chunks.first()
        self.assertEqual(chunk.day, date.today())
        self.assertEqual(chunk.duration, Decimal(1))
        self.assertFalse(chunk.finished)

    def test_schedule_task_for_today_submit_with_enter_duration(self):
        self.assertEqual(TaskChunk.objects.count(), 0)

        # create dummy task
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        schedule_link = self.selenium.find_element_by_xpath('//a[@data-tooltip="Schedule"]')
        schedule_link.click()
        sleep(0.1)
        modal_body = self.selenium.find_element_by_xpath('//div[contains(@class, "modal-body")]')
        self.assertIn(
            'Testtask',
            modal_body.get_attribute('innerHTML'))
        self.assertIn(
            '5h',
            modal_body.get_attribute('innerHTML'))
        duration_input = self.selenium.find_element_by_xpath(
            '//div[contains(@class, "modal-body")]//input[@placeholder="Duration"]')
        duration_input.clear()
        duration_input.send_keys('1')
        duration_input.send_keys(Keys.ENTER)
        sleep(0.5)

        self.assertEqual(task.chunks.count(), 1)
        chunk = task.chunks.first()
        self.assertEqual(chunk.day, date.today())
        self.assertEqual(chunk.duration, Decimal(1))
        self.assertFalse(chunk.finished)

    def test_schedule_task_for_tomorrow(self):
        self.assertEqual(TaskChunk.objects.count(), 0)

        # create dummy task
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        schedule_link = self.selenium.find_element_by_xpath('//a[@data-tooltip="Schedule"]')
        schedule_link.click()
        sleep(0.1)
        modal_body = self.selenium.find_element_by_xpath('//div[contains(@class, "modal-body")]')
        self.assertIn(
            'Testtask',
            modal_body.get_attribute('innerHTML'))
        self.assertIn(
            '5h',
            modal_body.get_attribute('innerHTML'))
        duration_input = self.selenium.find_element_by_xpath(
            '//div[contains(@class, "modal-body")]//input[@placeholder="Duration"]')
        duration_input.clear()
        duration_input.send_keys('1')
        schedule_for = self.selenium.find_element_by_xpath('//div[contains(@class, "modal-body")]//select')
        Select(schedule_for).select_by_visible_text(
            'Tomorrow')
        self.selenium.find_element_by_xpath('//input[@value="Schedule"]').click()
        sleep(0.5)

        self.assertEqual(task.chunks.count(), 1)
        chunk = task.chunks.first()
        self.assertEqual(chunk.day, date.today() + timedelta(days=1))
        self.assertEqual(chunk.duration, Decimal(1))
        self.assertFalse(chunk.finished)

    def test_schedule_task_for_next_free_capacity(self):
        self.assertEqual(TaskChunk.objects.count(), 0)

        # create dummy task
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)
        other_task = Task.objects.create(
            user=self.user,
            name='Placeholder Testtask',
            duration=30)
        # create task chunks to fill current and next 2 days
        TaskChunk.objects.bulk_create([
            TaskChunk(
                task=other_task, duration=10, day=date.today(), day_order=0),
            TaskChunk(
                task=other_task, duration=10, day=date.today() + timedelta(days=1), day_order=0),
            TaskChunk(
                task=other_task, duration=10, day=date.today() + timedelta(days=2), day_order=0)])

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        schedule_link = self.selenium.find_element_by_xpath('//a[@data-tooltip="Schedule"]')
        schedule_link.click()
        sleep(0.1)
        modal_body = self.selenium.find_element_by_xpath('//div[contains(@class, "modal-body")]')
        self.assertIn(
            'Testtask',
            modal_body.get_attribute('innerHTML'))
        self.assertIn(
            '5h',
            modal_body.get_attribute('innerHTML'))
        duration_input = self.selenium.find_element_by_xpath(
            '//div[contains(@class, "modal-body")]//input[@placeholder="Duration"]')
        duration_input.clear()
        duration_input.send_keys('1')
        schedule_for = self.selenium.find_element_by_xpath('//div[contains(@class, "modal-body")]//select')
        Select(schedule_for).select_by_visible_text(
            'Next Free Capacity')
        self.selenium.find_element_by_xpath('//input[@value="Schedule"]').click()
        sleep(0.5)

        self.assertEqual(task.chunks.count(), 1)
        chunk = task.chunks.first()
        self.assertEqual(chunk.day, date.today() + timedelta(days=3))
        self.assertEqual(chunk.duration, Decimal(1))
        self.assertFalse(chunk.finished)

    def test_schedule_task_for_another_time(self):
        self.assertEqual(TaskChunk.objects.count(), 0)

        # create dummy task
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        schedule_link = self.selenium.find_element_by_xpath('//a[@data-tooltip="Schedule"]')
        schedule_link.click()
        sleep(0.1)
        modal_body = self.selenium.find_element_by_xpath('//div[contains(@class, "modal-body")]')
        self.assertIn(
            'Testtask',
            modal_body.get_attribute('innerHTML'))
        self.assertIn(
            '5h',
            modal_body.get_attribute('innerHTML'))
        duration_input = self.selenium.find_element_by_xpath(
            '//div[contains(@class, "modal-body")]//input[@placeholder="Duration"]')
        duration_input.clear()
        duration_input.send_keys('1')
        schedule_for = self.selenium.find_element_by_xpath('//div[contains(@class, "modal-body")]//select')
        Select(schedule_for).select_by_visible_text(
            'Another Time')
        date_input = self.selenium.find_element_by_xpath(
            '//div[contains(@class, "modal-body")]//input[@placeholder="Schedule for date"]')
        date_input.send_keys(Keys.DELETE)
        date_input.send_keys('01/02/2017')
        self.selenium.find_element_by_xpath('//input[@value="Schedule"]').click()
        sleep(0.5)

        self.assertEqual(task.chunks.count(), 1)
        chunk = task.chunks.first()
        self.assertEqual(chunk.day, date(2017, 1, 2))
        self.assertEqual(chunk.duration, Decimal(1))
        self.assertFalse(chunk.finished)

    def test_schedule_task_for_another_time_submit_with_enter_date(self):
        self.assertEqual(TaskChunk.objects.count(), 0)

        # create dummy task
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        schedule_link = self.selenium.find_element_by_xpath('//a[@data-tooltip="Schedule"]')
        schedule_link.click()
        sleep(0.1)
        modal_body = self.selenium.find_element_by_xpath('//div[contains(@class, "modal-body")]')
        self.assertIn(
            'Testtask',
            modal_body.get_attribute('innerHTML'))
        self.assertIn(
            '5h',
            modal_body.get_attribute('innerHTML'))
        duration_input = self.selenium.find_element_by_xpath(
            '//div[contains(@class, "modal-body")]//input[@placeholder="Duration"]')
        duration_input.clear()
        duration_input.send_keys('1')
        schedule_for = self.selenium.find_element_by_xpath('//div[contains(@class, "modal-body")]//select')
        Select(schedule_for).select_by_visible_text(
            'Another Time')
        date_input = self.selenium.find_element_by_xpath(
            '//div[contains(@class, "modal-body")]//input[@placeholder="Schedule for date"]')
        date_input.send_keys(Keys.DELETE)
        date_input.send_keys('01/02/2017')
        date_input.send_keys(Keys.ENTER)
        sleep(0.5)

        self.assertEqual(task.chunks.count(), 1)
        chunk = task.chunks.first()
        self.assertEqual(chunk.day, date(2017, 1, 2))
        self.assertEqual(chunk.duration, Decimal(1))
        self.assertFalse(chunk.finished)

    def test_schedule_task_invalid_duration(self):
        self.assertEqual(TaskChunk.objects.count(), 0)

        # create dummy task
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        schedule_link = self.selenium.find_element_by_xpath('//a[@data-tooltip="Schedule"]')
        schedule_link.click()
        sleep(0.1)
        modal_body = self.selenium.find_element_by_xpath('//div[contains(@class, "modal-body")]')
        self.assertIn(
            'Testtask',
            modal_body.get_attribute('innerHTML'))
        self.assertIn(
            '5h',
            modal_body.get_attribute('innerHTML'))
        duration_input = self.selenium.find_element_by_xpath(
            '//div[contains(@class, "modal-body")]//input[@placeholder="Duration"]')
        duration_input.clear()
        duration_input.send_keys('-1')
        schedule_for = self.selenium.find_element_by_xpath('//div[contains(@class, "modal-body")]//select')
        self.selenium.find_element_by_xpath('//input[@value="Schedule"]').click()
        sleep(0.5)

        self.assertIn(
            'is-error',
            duration_input.get_attribute('class'))

        self.assertEqual(task.chunks.count(), 0)

    def test_task_unscheduled_finish(self):
        """
        Finish a task from the incomplete list that has no task chunks.
        """
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        self.selenium.find_element_by_css_selector('[data-tooltip="Complete task"]').click()
        sleep(0.5)

        self.assertRaises(
            ObjectDoesNotExist,
            task.refresh_from_db)

    def test_task_scheduled_finish(self):
        """
        Finish a task from the incomplete list that has task chunks.
        """
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)
        chunk = TaskChunk.objects.create(
            day=date.today(),
            task=task,
            duration=2,
            day_order=0)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        self.selenium.find_element_by_css_selector('[data-tooltip="Complete task"]').click()
        sleep(0.5)

        task.refresh_from_db()
        self.assertEqual(
            task.duration,
            Decimal('2'))

    def test_task_chunk_increase_time(self):
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)
        chunk = TaskChunk.objects.create(
            day=date.today(),
            task=task,
            duration=2,
            day_order=0)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        self.selenium.find_element_by_css_selector('[data-tooltip="Takes 30 more minutes"]').click()
        sleep(0.5)

        chunk.refresh_from_db()
        self.assertEqual(
            chunk.duration,
            Decimal('2.5'))

    def test_task_chunk_decrease_time(self):
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)
        chunk = TaskChunk.objects.create(
            day=date.today(),
            task=task,
            duration=2,
            day_order=0)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        self.selenium.find_element_by_css_selector('[data-tooltip="Takes 30 less minutes"]').click()
        sleep(0.5)

        chunk.refresh_from_db()
        self.assertEqual(
            chunk.duration,
            Decimal('1.5'))

    def test_task_chunk_finish(self):
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)
        chunk = TaskChunk.objects.create(
            day=date.today(),
            task=task,
            duration=2,
            day_order=0)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        self.selenium.find_element_by_css_selector('[data-tooltip="Done"]').click()
        sleep(0.5)

        chunk.refresh_from_db()
        self.assertTrue(chunk.finished)

    def test_task_chunk_undo(self):
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)
        chunk = TaskChunk.objects.create(
            day=date.today(),
            task=task,
            duration=2,
            day_order=0,
            finished=True)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        self.selenium.find_element_by_css_selector('[data-tooltip="Not done"]').click()
        sleep(0.5)

        chunk.refresh_from_db()
        self.assertFalse(chunk.finished)

    def test_task_chunk_delete(self):
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)
        chunk = TaskChunk.objects.create(
            day=date.today(),
            task=task,
            duration=2,
            day_order=0,
            finished=True)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        self.selenium.find_element_by_css_selector('[data-tooltip="No time needed on this day"]').click()
        alert = self.selenium.switch_to.alert
        alert.accept()
        sleep(0.5)

        self.assertRaises(ObjectDoesNotExist, chunk.refresh_from_db)
        task.refresh_from_db()
        self.assertEqual(
            task.duration,
            Decimal(3))

    def test_task_chunk_postpone(self):
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)
        chunk = TaskChunk.objects.create(
            day=date.today(),
            task=task,
            duration=2,
            day_order=0,
            finished=True)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        self.selenium.find_element_by_css_selector('[data-tooltip="Postpone to another day"]').click()
        sleep(0.5)

        self.assertRaises(ObjectDoesNotExist, chunk.refresh_from_db)
        task.refresh_from_db()
        self.assertEqual(
            task.duration,
            Decimal(5))

    def test_task_chunk_left(self):
        task1 = Task.objects.create(
            user=self.user,
            name='Task 1',
            duration=5)
        chunk1 = TaskChunk.objects.create(
            day=date.today(),
            task=task1,
            duration=2,
            day_order=0)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        self.selenium.find_elements_by_css_selector('[data-tooltip="Move to previous day"]')[0].click()
        sleep(0.5)

        chunk1.refresh_from_db()
        self.assertEqual(
            chunk1.day,
            date.today() - timedelta(days=1))

    def test_task_chunk_right(self):
        task1 = Task.objects.create(
            user=self.user,
            name='Task 1',
            duration=5)
        chunk1 = TaskChunk.objects.create(
            day=date.today(),
            task=task1,
            duration=2,
            day_order=0)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        self.selenium.find_elements_by_css_selector('[data-tooltip="Move to next day"]')[0].click()
        sleep(0.5)

        chunk1.refresh_from_db()
        self.assertEqual(
            chunk1.day,
            date.today() + timedelta(days=1))

    def test_task_chunk_up(self):
        task1 = Task.objects.create(
            user=self.user,
            name='Task 1',
            duration=5)
        chunk1 = TaskChunk.objects.create(
            day=date.today(),
            task=task1,
            duration=2,
            day_order=0)
        task2 = Task.objects.create(
            user=self.user,
            name='Task 2',
            duration=5)
        chunk2 = TaskChunk.objects.create(
            day=date.today(),
            task=task2,
            duration=1,
            day_order=1)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        self.selenium.find_elements_by_css_selector('[data-tooltip="Needs time earlier"]')[1].click()
        sleep(0.5)

        chunk1.refresh_from_db()
        chunk2.refresh_from_db()
        self.assertEqual(
            chunk1.day_order,
            1)
        self.assertEqual(
            chunk2.day_order,
            0)

    def test_task_chunk_down(self):
        task1 = Task.objects.create(
            user=self.user,
            name='Task 1',
            duration=5)
        chunk1 = TaskChunk.objects.create(
            day=date.today(),
            task=task1,
            duration=2,
            day_order=0)
        task2 = Task.objects.create(
            user=self.user,
            name='Task 2',
            duration=5)
        chunk2 = TaskChunk.objects.create(
            day=date.today(),
            task=task2,
            duration=1,
            day_order=1)

        self.selenium.get(self.frontend_url)
        sleep(0.5)
        self.selenium.find_elements_by_css_selector('[data-tooltip="Needs time later"]')[0].click()
        sleep(0.5)

        chunk1.refresh_from_db()
        chunk2.refresh_from_db()
        self.assertEqual(
            chunk1.day_order,
            1)
        self.assertEqual(
            chunk2.day_order,
            0)

    def test_missed_task_chunk_finish(self):
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)
        chunk = TaskChunk.objects.create(
            day=date.today() - timedelta(days=4),
            task=task,
            duration=2,
            day_order=0)

        self.selenium.get(self.frontend_url)
        sleep(0.5)

        self.assertIn(
            'There are unfinished scheduled tasks for past days!',
            self.selenium.execute_script('return document.documentElement.innerHTML'))

        self.selenium.find_element_by_css_selector('[data-tooltip="Done"]').click()
        sleep(0.5)

        chunk.refresh_from_db()
        self.assertTrue(chunk.finished)

    def test_missed_task_chunk_postpone(self):
        task = Task.objects.create(
            user=self.user,
            name='Testtask',
            duration=5)
        chunk = TaskChunk.objects.create(
            day=date.today() - timedelta(days=4),
            task=task,
            duration=2,
            day_order=0)

        self.selenium.get(self.frontend_url)
        sleep(0.5)

        self.assertIn(
            'There are unfinished scheduled tasks for past days!',
            self.selenium.page_source)

        self.selenium.find_element_by_css_selector('[data-tooltip="Postpone to another day"]').click()
        sleep(0.5)

        self.assertRaises(ObjectDoesNotExist, chunk.refresh_from_db)
