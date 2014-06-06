json.array!(@groceries) do |grocery|
  json.extract! grocery, :id, :item, :price, :healthy, :bought
  json.url grocery_url(grocery, format: :json)
end
