from django.contrib.staticfiles.templatetags.staticfiles import static

from wagtail.wagtailcore import hooks


@hooks.register('insert_editor_js')
def editor_js():
    files = [
        'streamfield_alt/vendor/react-with-addons.js',
        'streamfield_alt/vendor/react-dom.js',
        'streamfield_alt/compiled/streamfield.bundle.js',
    ]

    return ''.join(
        '<script src="{0}"></script>'.format(static(f))
        for f in files
    )


@hooks.register('insert_editor_css')
def editor_css():
    return '<link rel="stylesheet" href="{0}">'.format(static('streamfield_alt/streamfield.css'))
