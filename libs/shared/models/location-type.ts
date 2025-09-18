export interface LocationType {
  locationTypeId: number;
  typeCode: string;
  description: string;
  active: number;
}

export class LocationTypeModel implements LocationType {
  locationTypeId: number;
  typeCode: string;
  description: string;
  active: number;

  constructor(data: LocationType) {
    this.locationTypeId = data.locationTypeId;
    this.typeCode = data.typeCode;
    this.description = data.description;
    this.active = data.active;
  }
}
