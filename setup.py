from setuptools import setup

setup(name='glasseye',
      version='0.1.15',
      description='A python module for converting markdown documents into the glasseye format',
      url='https://github.com/coppeliaMLA/glasseye',
      author='coppeliamla',
      author_email='info@coppelia.io',
      license='MIT',
      packages=['glasseye'],
      zip_safe=False,
      entry_points = {
        'console_scripts': ['glasseye=glasseye.__main__:main'],
      },
      include_package_data=True,
      install_requires=[
          'pypandoc', 'beautifulsoup4'
      ])
