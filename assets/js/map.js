// Simple Map System for GemaNusa
console.log("=== SIMPLE MAP SYSTEM LOADED ===")

class SimpleMapSystem {
    constructor() {
        this.currentScope = 'national'
        this.currentMap = null
        this.mapContainer = null
        this.tooltip = null
        this.indonesiaData = null
        this.worldData = null
        this.programLocations = this.initializeProgramLocations()
        
        this.init()
    }

    init() {
        console.log("MapSystem initializing...")
        this.setupEventListeners()
        this.loadMapData()
    }

    initializeProgramLocations() {
        return {
            // Program Domestik Indonesia
            mentor_muda_nusantara: {
                provinces: ['DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'Sumatera Utara', 'Sulawesi Selatan'],
                countries: [],
                scope: 'indonesia',
                type: 'education'
            },
            perpustakaan_hidup: {
                provinces: ['DI Yogyakarta', 'Jawa Tengah', 'Jawa Timur', 'Jawa Barat', 'Bali'],
                countries: [],
                scope: 'indonesia',
                type: 'education'
            },
            sahabat_hutan: {
                provinces: ['Kalimantan Tengah', 'Riau', 'Papua Barat', 'Sulawesi Tengah', 'Sumatera Selatan'],
                countries: [],
                scope: 'indonesia',
                type: 'conservation'
            },
            laut_bersih_bersinar: {
                provinces: ['Bali', 'Nusa Tenggara Barat', 'Papua Barat', 'Sulawesi Utara', 'Nusa Tenggara Timur'],
                countries: [],
                scope: 'indonesia',
                type: 'conservation'
            },
            dapur_peduli: {
                provinces: ['DKI Jakarta', 'Jawa Barat', 'Sumatera Barat'],
                countries: [],
                scope: 'indonesia',
                type: 'social'
            },
            gerakan_sembako_harapan: {
                provinces: ['DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur'],
                countries: [],
                scope: 'indonesia',
                type: 'social'
            },
            tech_for_good: {
                provinces: ['DKI Jakarta', 'Jawa Barat', 'DI Yogyakarta', 'Jawa Timur', 'Bali'],
                countries: [],
                scope: 'indonesia',
                type: 'technology'
            },
            smart_village_project: {
                provinces: ['DI Yogyakarta', 'Jawa Tengah', 'Kalimantan Barat'],
                countries: [],
                scope: 'indonesia',
                type: 'technology'
            },
            
            // Program Internasional
            global_climate_action: {
                provinces: [],
                countries: ['Malaysia', 'Thailand', 'Philippines', 'Singapore'],
                scope: 'world',
                type: 'conservation'
            },
            asean_youth_exchange: {
                provinces: [],
                countries: ['Malaysia', 'Thailand', 'Vietnam', 'Philippines', 'Singapore'],
                scope: 'world',
                type: 'education'
            },
            ocean_guardian_network: {
                provinces: [],
                countries: ['Australia', 'Philippines', 'Malaysia'],
                scope: 'world',
                type: 'conservation'
            },
            digital_literacy_asia: {
                provinces: [],
                countries: ['India', 'Vietnam', 'Thailand', 'Malaysia'],
                scope: 'world',
                type: 'technology'
            },
            sustainable_cities_initiative: {
                provinces: [],
                countries: ['Japan', 'South Korea', 'Singapore', 'Netherlands'],
                scope: 'world',
                type: 'technology'
            }
        }
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            console.log("DOM loaded, initializing map...")
            setTimeout(() => this.initializeMap(), 1000) // Give more time for components to load
        })

        // Handle window resize
        window.addEventListener('resize', () => {
            if (this.currentMap) {
                this.resizeMap()
            }
        })
    }

    async loadMapData() {
        try {
            // Load Indonesia provinces data
            const indonesiaResponse = await fetch('../assets/data/indonesia-map.json')
            this.indonesiaData = await indonesiaResponse.json()
            console.log("Indonesia map data loaded")

            // Load World countries data  
            const worldResponse = await fetch('../assets/data/world-map.json')
            this.worldData = await worldResponse.json()
            console.log("World map data loaded")

        } catch (error) {
            console.error("Error loading map data:", error)
            // Fallback to simplified data
            this.createFallbackData()
        }
    }

    createFallbackData() {
        // Simplified Indonesia provinces for fallback
        this.indonesiaData = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: { name: "DKI Jakarta", id: "ID-JK" },
                    geometry: { type: "Polygon", coordinates: [[[-106.8, -6.1], [-106.7, -6.1], [-106.7, -6.2], [-106.8, -6.2], [-106.8, -6.1]]] }
                },
                {
                    type: "Feature", 
                    properties: { name: "Jawa Barat", id: "ID-JB" },
                    geometry: { type: "Polygon", coordinates: [[[-107.5, -6.0], [-106.0, -6.0], [-106.0, -7.5], [-107.5, -7.5], [-107.5, -6.0]]] }
                },
                {
                    type: "Feature",
                    properties: { name: "Jawa Tengah", id: "ID-JT" },
                    geometry: { type: "Polygon", coordinates: [[[-111.0, -6.5], [-108.5, -6.5], [-108.5, -8.0], [-111.0, -8.0], [-111.0, -6.5]]] }
                },
                {
                    type: "Feature",
                    properties: { name: "DI Yogyakarta", id: "ID-YO" },
                    geometry: { type: "Polygon", coordinates: [[[-110.5, -7.5], [-110.0, -7.5], [-110.0, -8.0], [-110.5, -8.0], [-110.5, -7.5]]] }
                },
                {
                    type: "Feature",
                    properties: { name: "Jawa Timur", id: "ID-JI" },
                    geometry: { type: "Polygon", coordinates: [[[-114.0, -7.0], [-111.0, -7.0], [-111.0, -8.5], [-114.0, -8.5], [-114.0, -7.0]]] }
                }
            ]
        }

        this.worldData = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: { name: "Indonesia", id: "ID" },
                    geometry: { type: "Polygon", coordinates: [[[95, -11], [141, -11], [141, 6], [95, 6], [95, -11]]] }
                }
            ]
        }
    }

    initializeMap() {
        this.mapContainer = document.getElementById('map-container')
        if (!this.mapContainer) {
            console.log("Map container not found, waiting...")
            setTimeout(() => this.initializeMap(), 500)
            return
        }

        console.log("Map container found, initializing simple map...")
        this.createTooltip()
        this.renderSimpleMap('indonesia') // Start with Indonesia
        
        // Hide loading indicator
        setTimeout(() => {
            const loading = document.getElementById('map-loading')
            if (loading) {
                loading.style.display = 'none'
            }
        }, 1000)
    }

    switchMap(scope) {
        console.log("Switching map to:", scope)
        this.renderSimpleMap(scope)
    }

    createTooltip() {
        this.tooltip = document.createElement('div')
        this.tooltip.className = 'map-tooltip absolute bg-white p-3 rounded-lg shadow-lg border border-gray-200 pointer-events-none z-50 hidden'
        this.tooltip.style.cssText = 'transform: translate(-50%, -100%); margin-top: -10px;'
        document.body.appendChild(this.tooltip)
    }

    renderSimpleMap(scope = 'indonesia') {
        if (!this.mapContainer) {
            console.error("Map container not found")
            return
        }

        // Clear existing map
        this.mapContainer.innerHTML = ''

        // Create SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('width', '100%')
        svg.setAttribute('height', '400')
        svg.setAttribute('viewBox', '0 0 800 400')
        svg.className = 'w-full h-full'

        let mapData = scope === 'indonesia' ? this.indonesiaData : this.worldData

        // Use fallback if data not loaded yet
        if (!mapData) {
            console.log("Map data not loaded, using fallback...")
            const fallbackPaths = this.createSimpleFallbackPaths(scope)
            fallbackPaths.forEach(path => svg.appendChild(path))
        } else {
            // Render actual map data
            mapData.features.forEach(feature => {
                const path = this.createSimpleMapPath(feature, scope)
                svg.appendChild(path)
            })
        }

        this.mapContainer.appendChild(svg)
        this.currentMap = svg

        console.log(`Simple map rendered for scope: ${scope}`)
    }

    createSimpleMapPath(feature, scope) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        
        // Convert GeoJSON coordinates to SVG path
        const pathString = this.geoJsonToSvgPath(feature.geometry, scope)
        path.setAttribute('d', pathString)
        
        // Get program count for this region
        const regionName = feature.properties.name
        const programCount = this.getProgramCountForRegion(regionName, scope)
        
        // Simple styling based on program availability
        if (programCount > 0) {
            path.setAttribute('fill', '#93c5fd') // blue-300 - has programs
            path.setAttribute('stroke', '#000000')
            path.setAttribute('stroke-width', '1')
        } else {
            path.setAttribute('fill', '#e5e7eb') // gray-200 - no programs
            path.setAttribute('stroke', '#000000')
            path.setAttribute('stroke-width', '1')
        }
        
        path.className = 'map-region transition-all duration-300 cursor-pointer hover:opacity-80'
        
        // Data attributes
        path.setAttribute('data-region', regionName)
        path.setAttribute('data-program-count', programCount)
        
        // Event listeners
        path.addEventListener('mouseenter', (e) => this.showTooltip(e, regionName, programCount))
        path.addEventListener('mouseleave', () => this.hideTooltip())
        path.addEventListener('mousemove', (e) => this.updateTooltipPosition(e))
        path.addEventListener('click', () => this.handleRegionClick(regionName))
        
        return path
    }

    createSimpleFallbackPaths(scope) {
        const paths = []
        
        if (scope === 'world') {
            // Simple world countries
            const countries = [
                { name: 'Indonesia', path: 'M 300 180 L 500 180 L 500 220 L 300 220 Z', hasProgram: true },
                { name: 'Malaysia', path: 'M 280 160 L 320 160 L 320 180 L 280 180 Z', hasProgram: true },
                { name: 'Thailand', path: 'M 250 140 L 290 140 L 290 180 L 250 180 Z', hasProgram: true },
                { name: 'Philippines', path: 'M 520 160 L 560 160 L 560 200 L 520 200 Z', hasProgram: true },
                { name: 'Singapore', path: 'M 290 185 L 310 185 L 310 195 L 290 195 Z', hasProgram: true },
                { name: 'Australia', path: 'M 350 250 L 550 250 L 550 320 L 350 320 Z', hasProgram: true },
                { name: 'Japan', path: 'M 600 120 L 650 120 L 650 180 L 600 180 Z', hasProgram: true },
                { name: 'India', path: 'M 150 140 L 230 140 L 230 220 L 150 220 Z', hasProgram: true }
            ]
            
            countries.forEach(country => {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
                path.setAttribute('d', country.path)
                path.setAttribute('fill', country.hasProgram ? '#93c5fd' : '#e5e7eb')
                path.setAttribute('stroke', '#000000')
                path.setAttribute('stroke-width', '1')
                path.className = 'map-region transition-all duration-300 cursor-pointer hover:opacity-80'
                path.setAttribute('data-region', country.name)
                path.setAttribute('data-program-count', country.hasProgram ? '2' : '0')
                
                path.addEventListener('mouseenter', (e) => this.showTooltip(e, country.name, country.hasProgram ? 2 : 0))
                path.addEventListener('mouseleave', () => this.hideTooltip())
                path.addEventListener('mousemove', (e) => this.updateTooltipPosition(e))
                path.addEventListener('click', () => this.handleRegionClick(country.name))
                
                paths.push(path)
            })
        } else {
            // Simple Indonesia provinces
            const provinces = [
                { name: 'DKI Jakarta', path: 'M 380 200 L 420 200 L 420 220 L 380 220 Z', hasProgram: true },
                { name: 'Jawa Barat', path: 'M 340 200 L 380 200 L 380 240 L 340 240 Z', hasProgram: true },
                { name: 'Jawa Tengah', path: 'M 420 200 L 460 200 L 460 240 L 420 240 Z', hasProgram: true },
                { name: 'DI Yogyakarta', path: 'M 440 220 L 470 220 L 470 240 L 440 240 Z', hasProgram: true },
                { name: 'Jawa Timur', path: 'M 460 200 L 520 200 L 520 240 L 460 240 Z', hasProgram: true },
                { name: 'Bali', path: 'M 520 210 L 550 210 L 550 230 L 520 230 Z', hasProgram: true },
                { name: 'Sumatera Utara', path: 'M 200 120 L 280 120 L 280 160 L 200 160 Z', hasProgram: true },
                { name: 'Riau', path: 'M 250 160 L 320 160 L 320 190 L 250 190 Z', hasProgram: true },
                { name: 'Kalimantan Tengah', path: 'M 300 240 L 400 240 L 400 300 L 300 300 Z', hasProgram: true },
                { name: 'Papua Barat', path: 'M 550 180 L 620 180 L 620 240 L 550 240 Z', hasProgram: true }
            ]
            
            provinces.forEach(province => {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
                path.setAttribute('d', province.path)
                path.setAttribute('fill', province.hasProgram ? '#93c5fd' : '#e5e7eb')
                path.setAttribute('stroke', '#000000')
                path.setAttribute('stroke-width', '1')
                path.className = 'map-region transition-all duration-300 cursor-pointer hover:opacity-80'
                path.setAttribute('data-region', province.name)
                path.setAttribute('data-program-count', province.hasProgram ? '3' : '0')
                
                path.addEventListener('mouseenter', (e) => this.showTooltip(e, province.name, province.hasProgram ? 3 : 0))
                path.addEventListener('mouseleave', () => this.hideTooltip())
                path.addEventListener('mousemove', (e) => this.updateTooltipPosition(e))
                path.addEventListener('click', () => this.handleRegionClick(province.name))
                
                paths.push(path)
            })
        }
        
        return paths
    }

    createMapPath(feature, scope) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        
        // Convert GeoJSON coordinates to SVG path
        const pathString = this.geoJsonToSvgPath(feature.geometry, scope)
        path.setAttribute('d', pathString)
        
        // Styling
        path.setAttribute('fill', '#e5e7eb') // gray-200
        path.setAttribute('stroke', '#d1d5db') // gray-300
        path.setAttribute('stroke-width', '1')
        path.className = 'map-region transition-all duration-300 cursor-pointer hover:fill-blue-200'
        
        // Data attributes
        path.setAttribute('data-region', feature.properties.name)
        path.setAttribute('data-id', feature.properties.id)
        
        // Calculate program count for this region
        const programCount = this.getProgramCountForRegion(feature.properties.name)
        path.setAttribute('data-program-count', programCount)
        
        // Event listeners
        path.addEventListener('mouseenter', (e) => this.showTooltip(e, feature.properties.name, programCount))
        path.addEventListener('mouseleave', () => this.hideTooltip())
        path.addEventListener('mousemove', (e) => this.updateTooltipPosition(e))
        path.addEventListener('click', () => this.handleRegionClick(feature.properties.name))
        
        return path
    }

    geoJsonToSvgPath(geometry, scope) {
        // Simplified conversion - in real implementation, use proper projection
        if (geometry.type === 'Polygon') {
            return this.polygonToPath(geometry.coordinates[0], scope)
        } else if (geometry.type === 'MultiPolygon') {
            return geometry.coordinates.map(polygon => 
                this.polygonToPath(polygon[0], scope)
            ).join(' ')
        }
        return ''
    }

    polygonToPath(coordinates, scope) {
        if (!coordinates || coordinates.length === 0) return ''
        
        // Simple projection for demonstration
        const bounds = scope === 'global' ? 
            { minX: -180, maxX: 180, minY: -90, maxY: 90 } :
            { minX: 95, maxX: 141, minY: -11, maxY: 6 }
        
        const scaleX = 800 / (bounds.maxX - bounds.minX)
        const scaleY = 400 / (bounds.maxY - bounds.minY)
        
        let path = ''
        coordinates.forEach((coord, index) => {
            const x = (coord[0] - bounds.minX) * scaleX
            const y = 400 - (coord[1] - bounds.minY) * scaleY
            
            if (index === 0) {
                path += `M ${x} ${y}`
            } else {
                path += ` L ${x} ${y}`
            }
        })
        path += ' Z'
        
        return path
    }

    createFallbackPaths(scope) {
        const paths = []
        
        if (scope === 'global') {
            // Simple world representation
            const worldPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
            worldPath.setAttribute('d', 'M 100 150 L 700 150 L 700 250 L 100 250 Z')
            worldPath.setAttribute('fill', '#e5e7eb')
            worldPath.setAttribute('stroke', '#d1d5db')
            worldPath.setAttribute('stroke-width', '2')
            worldPath.className = 'map-region transition-all duration-300 cursor-pointer hover:fill-blue-200'
            worldPath.setAttribute('data-region', 'Indonesia')
            worldPath.setAttribute('data-program-count', '25')
            
            worldPath.addEventListener('mouseenter', (e) => this.showTooltip(e, 'Indonesia', 25))
            worldPath.addEventListener('mouseleave', () => this.hideTooltip())
            worldPath.addEventListener('mousemove', (e) => this.updateTooltipPosition(e))
            worldPath.addEventListener('click', () => this.handleRegionClick('Indonesia'))
            
            paths.push(worldPath)
        } else {
            // Simple Indonesia provinces
            const provinces = [
                { name: 'DKI Jakarta', path: 'M 300 200 L 350 200 L 350 220 L 300 220 Z', count: 15 },
                { name: 'Jawa Barat', path: 'M 250 200 L 300 200 L 300 240 L 250 240 Z', count: 12 },
                { name: 'Jawa Tengah', path: 'M 350 200 L 400 200 L 400 240 L 350 240 Z', count: 8 },
                { name: 'DI Yogyakarta', path: 'M 380 220 L 420 220 L 420 240 L 380 240 Z', count: 5 },
                { name: 'Jawa Timur', path: 'M 400 200 L 480 200 L 480 240 L 400 240 Z', count: 10 }
            ]
            
            provinces.forEach(province => {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
                path.setAttribute('d', province.path)
                path.setAttribute('fill', '#e5e7eb')
                path.setAttribute('stroke', '#d1d5db')
                path.setAttribute('stroke-width', '1')
                path.className = 'map-region transition-all duration-300 cursor-pointer hover:fill-blue-200'
                path.setAttribute('data-region', province.name)
                path.setAttribute('data-program-count', province.count)
                
                path.addEventListener('mouseenter', (e) => this.showTooltip(e, province.name, province.count))
                path.addEventListener('mouseleave', () => this.hideTooltip())
                path.addEventListener('mousemove', (e) => this.updateTooltipPosition(e))
                path.addEventListener('click', () => this.handleRegionClick(province.name))
                
                paths.push(path)
            })
        }
        
        return paths
    }

    getProgramCountForRegion(regionName, scope = 'indonesia') {
        let count = 0
        Object.values(this.programLocations).forEach(program => {
            if (scope === 'indonesia' && program.scope === 'indonesia') {
                if (program.provinces.includes(regionName)) {
                    count += 1
                }
            } else if (scope === 'world' && program.scope === 'world') {
                if (program.countries.includes(regionName)) {
                    count += 1
                }
            }
        })
        return count
    }

    showTooltip(event, regionName, programCount) {
        if (!this.tooltip) return
        
        this.tooltip.innerHTML = `
            <div class="font-semibold text-batu-gray">${regionName}</div>
            <div class="text-sm text-gray-600">${programCount} Program Aktif</div>
        `
        this.tooltip.classList.remove('hidden')
        this.updateTooltipPosition(event)
    }

    updateTooltipPosition(event) {
        if (!this.tooltip) return
        
        this.tooltip.style.left = event.pageX + 'px'
        this.tooltip.style.top = event.pageY + 'px'
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.classList.add('hidden')
        }
    }

    handleRegionClick(regionName) {
        console.log(`Region clicked: ${regionName}`)
        
        // Highlight region
        this.highlightRegion(regionName)
        
        // Scroll to program catalog
        setTimeout(() => {
            const catalogSection = document.getElementById('program-catalog')
            if (catalogSection) {
                catalogSection.scrollIntoView({ behavior: 'smooth' })
            }
        }, 300)
        
        // Filter programs by region
        if (window.programCatalog) {
            setTimeout(() => {
                window.programCatalog.filterByRegion(regionName)
            }, 800)
        }
    }

    highlightRegion(regionName) {
        // Remove previous highlights
        document.querySelectorAll('.map-region').forEach(region => {
            region.classList.remove('fill-purple-300', 'stroke-purple-500')
            region.setAttribute('stroke-width', '1')
        })
        
        // Highlight selected region
        const targetRegion = document.querySelector(`[data-region="${regionName}"]`)
        if (targetRegion) {
            targetRegion.classList.add('fill-purple-300', 'stroke-purple-500')
            targetRegion.setAttribute('stroke-width', '3')
        }
    }

    setScope(scope) {
        console.log(`Setting map scope to: ${scope}`)
        this.renderMap(scope)
    }

    handleQuestIntegration(questResults) {
        console.log("Handling quest integration with map:", questResults)
        
        // Extract scope from quest results
        let scope = 'national'
        if (questResults.responses && questResults.responses.q4_scope) {
            const scopeSelection = questResults.responses.q4_scope.selections[0]
            const scopeMap = {
                'local_community': 'local',
                'city_level': 'city', 
                'national_level': 'national',
                'global_level': 'global'
            }
            scope = scopeMap[scopeSelection] || 'national'
        }
        
        this.setScope(scope)
        
        // Highlight regions related to recommended programs
        if (questResults.results && questResults.results.length > 0) {
            const topProgram = questResults.results[0][0]
            const programLocation = this.programLocations[topProgram]
            
            if (programLocation && programLocation.provinces.length > 0) {
                setTimeout(() => {
                    this.highlightRegion(programLocation.provinces[0])
                }, 500)
            }
        }
    }

    resizeMap() {
        // Handle responsive resize
        if (this.currentMap) {
            const container = this.mapContainer
            const containerWidth = container.offsetWidth
            const containerHeight = Math.min(400, containerWidth * 0.5)
            
            this.currentMap.setAttribute('height', containerHeight)
        }
    }
}

// Initialize Simple Map System
function initializeSimpleMapSystem() {
    if (!window.simpleMapSystem) {
        window.simpleMapSystem = new SimpleMapSystem()
        console.log("Simple Map System initialized")
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initializeSimpleMapSystem)

// Fallback initialization
if (document.readyState !== 'loading') {
    initializeSimpleMapSystem()
}

// Additional fallback
setTimeout(() => {
    if (!window.simpleMapSystem) {
        console.log("Fallback simple map system initialization...")
        initializeSimpleMapSystem()
    }
}, 1000)