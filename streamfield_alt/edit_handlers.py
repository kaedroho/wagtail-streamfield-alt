import json

from django.core.serializers.json import DjangoJSONEncoder

from wagtail.wagtailadmin.edit_handlers import BaseFieldPanel

from .schema import get_block_schema


class BaseStreamFieldPanel(BaseFieldPanel):
    object_template = "streamfield_alt/streamfield.html"

    def get_data_json(self):
        value = self.bound_field.value()
        return json.dumps(self.block_def.get_prep_value(value), cls=DjangoJSONEncoder)

    @classmethod
    def get_schema_json(cls):
        return json.dumps(get_block_schema(cls.block_def))


class StreamFieldPanel(object):
    def __init__(self, field_name):
        self.field_name = field_name

    def bind_to_model(self, model):
        return type(str('_StreamFieldPanel'), (BaseStreamFieldPanel,), {
            'model': model,
            'field_name': self.field_name,
            'block_def': model._meta.get_field(self.field_name).stream_block
        })
