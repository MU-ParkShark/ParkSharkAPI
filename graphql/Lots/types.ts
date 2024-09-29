export const lotTypes = `
enum LotType {
    commuter
    resident
    faculty
}

type Coordinate {
    x: Float
    y: Float
}

type BoundingBox {
    topLeft: [Coordinate]
    bottomRight: [Coordinate]
}

type Lot {
    lot_id: Int
	lot_type: LotType
	is_available: Boolean
	auto_lot_id: Int
	bounding_box: BoundingBox
}

input CoordinateCreationInput {
    x: Float!
    y: Float!
}

input PossibleCoordinateInput {
    x: Float
    y: Float
}

input BoundingBoxCreationInput {
    topLeft: [CoordinateCreationInput]!
    bottomRight: [CoordinateCreationInput]!
}

input PossibleBoundingBoxInput {
    topLeft: [PossibleCoordinateInput]
    bottomRight: [PossibleCoordinateInput]
}

input LotCreationInput {
    lot_type: LotType!
    is_available: Boolean
    bounding_box: BoundingBoxCreationInput
}

input PossibleLotInput {
    lot_type: LotType
    is_available: Boolean
    bounding_box: PossibleBoundingBoxInput
}
`;