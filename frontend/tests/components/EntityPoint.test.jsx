import { EntityPoint } from '@components/EntityPoint';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Cartesian3 } from 'cesium';

const position = {
    longitude: -118.17,
    latitude: -34.07,
    height: 300,
};

describe('EntityPoint Component', () => {
    it('renders Entity with correct position', () => {
        const mockCesiumFromDegrees = vi.spyOn(Cartesian3, 'fromDegrees');

        render(<EntityPoint {...position}></EntityPoint>);
        expect(mockCesiumFromDegrees).toHaveBeenCalledWith(
            position.longitude,
            position.latitude,
            position.height
        );
    });
});
