from wagtail.wagtailadmin.edit_handlers import BaseFieldPanel


class BaseStreamFieldPanel(BaseFieldPanel):
    def classes(self):
        classes = super(BaseStreamFieldPanel, self).classes()
        classes.append("stream-field")

        # In case of a validation error, BlockWidget will take care of outputting the error on the
        # relevant sub-block, so we don't want the stream block as a whole to be wrapped in an 'error' class.
        if 'error' in classes:
            classes.remove("error")

        return classes

    @classmethod
    def html_declarations(cls):
        return cls.block_def.all_html_declarations()

    def id_for_label(self):
        # a StreamField may consist of many input fields, so it's not meaningful to
        # attach the label to any specific one
        return ""


class StreamFieldPanel(object):
    def __init__(self, field_name):
        self.field_name = field_name

    def bind_to_model(self, model):
        return type(str('_StreamFieldPanel'), (BaseStreamFieldPanel,), {
            'model': model,
            'field_name': self.field_name,
            'block_def': model._meta.get_field(self.field_name).stream_block
        })
