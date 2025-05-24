import unittest
import sys
import os

# Add src directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src')))

from main import greet

class TestMain(unittest.TestCase):
    def test_greet(self):
        self.assertEqual(greet(), "Hello, World!")

if __name__ == '__main__':
    unittest.main()
