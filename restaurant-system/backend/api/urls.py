from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.kitchen_dashboard_view, name='kitchen_dashboard'),

    # Criar um novo pedido
    path('orders/', views.orders, name='create_order'), #POST

    # Listar todos os pedidos
    path('orders/summary/', views.kitchen_dashboard, name='kitchen_dashboard'), #GET

    # Atualizar o status de um pedido
    path('orders/<int:order_id>/status/', views.update_order_status, name='update_order_status'),

    # Deletar um pedido
    path('orders/<int:order_id>/', views.delete_order, name='delete_order'),

    # Listar categorias e pratos 
    path('categories/', views.category_list, name='category_list'),

    # Listar mesas
    path('tables/', views.table_list, name='table_list'),
]