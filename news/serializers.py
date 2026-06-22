from rest_framework import serializers
from notifications.models import News


class NewsSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    house_address = serializers.CharField(source='house.address', read_only=True)

    class Meta:
        model = News
        fields = [
            'id', 'title', 'content', 'audience', 'house', 'house_address',
            'is_active', 'author', 'author_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['author', 'created_at', 'updated_at']