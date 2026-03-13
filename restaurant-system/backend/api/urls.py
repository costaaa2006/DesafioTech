from django.urls import path
from . import views

urlpatterns = [

    # Criar um novo pedido
    path('orders/', views.create_order, name='create_order'),

    # Listar todos os pedidos
    path('orders/summary/', views.list_orders, name='list_orders'),

    # Atualizar o status de um pedido
    path('orders/<int:order_id>/status/', views.update_order_status, name='update_order_status'),
]