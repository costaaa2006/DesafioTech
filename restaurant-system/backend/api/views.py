from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Order, Category, Table
from .serializers import OrderSerializer, KitchenOrderSerializer, CategorySerializer, TableSerializer
from django.shortcuts import render
from django.utils import timezone
from datetime import timedelta

def kitchen_dashboard_view(request):
    return render(request, "api/kitchen_dashboard.html")

@api_view(["POST"])
def orders(request):
    serializer = OrderSerializer(data=request.data)

    if serializer.is_valid():
        order = serializer.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PATCH"])
def update_order_status(request, order_id):

    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status')
    if new_status not in dict(Order.STATUS_CHOICES):
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

    order.status = new_status
    order.save()
    return Response(OrderSerializer(order).data)

@api_view(["GET"])
def kitchen_dashboard(request):
    cutoff = timezone.now() - timedelta(seconds=10)

    orders = Order.objects.exclude(status="CO") | \
             Order.objects.filter(status="CO", updated_at__gte=cutoff)

    serializer = KitchenOrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
def delete_order(request, order_id):

    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({"detail": "Pedido não encontrado."}, status=status.HTTP_404_NOT_FOUND)
    
    order.delete()
    return Response({"detail": "Pedido removido com sucesso."}, status=status.HTTP_204_NO_CONTENT)

@api_view(["GET"])
def category_list(request):
    categories = Category.objects.prefetch_related('dishes__ingredients')
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def table_list(request):
    tables = Table.objects.all()
    serializer = TableSerializer(tables, many=True)
    return Response(serializer.data)