const axios = require('axios');
const Series = require('../models/Series');
const Activity = require('../models/Activity');

const TMDB_BASE = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_KEY = process.env.TMDB_API_KEY;
const TMDB_IMG = 'https://image.tmdb.org/t/p/original';

// GET /api/series — paginated list with filters
exports.getSeries = async (req, res) => {
  try {
    const { page = 1, limit = 20, genre, year, status, sort = '-createdAt', search } = req.query;
    const query = {};

    if (genre) query.genres = genre;
    if (year) query.year = parseInt(year);
    if (status) query.status = status;
    if (search) {
      query.$text = { $search: search };
    }

    const total = await Series.countDocuments(query);
    const series = await Series.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-seasons -__v');

    res.json({
      success: true,
      data: series,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch series' });
  }
};

// GET /api/series/featured
exports.getFeatured = async (req, res) => {
  try {
    const featured = await Series.find({ isFeatured: true })
      .sort('-rating')
      .limit(5)
      .select('title titleKorean description poster backdrop rating year genres trailers');
    res.json({ success: true, data: featured });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch featured series' });
  }
};

// GET /api/series/trending
exports.getTrending = async (req, res) => {
  try {
    const trending = await Series.find({ isTrending: true })
      .sort('-views')
      .limit(10)
      .select('title titleKorean poster backdrop rating year genres views');
    res.json({ success: true, data: trending });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending' });
  }
};

// GET /api/series/by-genre
exports.getByGenre = async (req, res) => {
  try {
    const genres = ['Romance', 'Action', 'Thriller', 'Comedy', 'Fantasy', 'Historical', 'Crime', 'Mystery'];
    const results = await Promise.all(
      genres.map(async (genre) => {
        const series = await Series.find({ genres: genre })
          .sort('-rating')
          .limit(10)
          .select('title poster backdrop rating year genres views');
        return { genre, series };
      })
    );
    const filtered = results.filter(r => r.series.length > 0);
    res.json({ success: true, data: filtered });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch by genre' });
  }
};

// GET /api/series/:id
exports.getSeriesById = async (req, res) => {
  try {
    const series = await Series.findById(req.params.id);
    if (!series) return res.status(404).json({ error: 'Series not found' });

    // Increment views
    await Series.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    // Log activity if user is logged in
    if (req.user) {
      await Activity.create({
        user: req.user._id,
        series: series._id,
        type: 'view'
      });
    }

    res.json({ success: true, data: series });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch series' });
  }
};

// GET /api/series/recommendations/:id — AI-style recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const series = await Series.findById(req.params.id);
    if (!series) return res.status(404).json({ error: 'Series not found' });

    // Find similar series by genres, year range, rating
    const recommendations = await Series.find({
      _id: { $ne: series._id },
      $or: [
        { genres: { $in: series.genres } },
        { year: { $gte: series.year - 2, $lte: series.year + 2 } }
      ]
    })
      .sort('-rating -views')
      .limit(10)
      .select('title poster backdrop rating year genres');

    res.json({ success: true, data: recommendations });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};

// GET /api/series/search
exports.searchSeries = async (req, res) => {
  try {
    const { q, genre, year, minRating, maxRating, sort = '-rating' } = req.query;

    if (!q && !genre && !year) {
      return res.status(400).json({ error: 'Provide search query or filters' });
    }

    const query = {};
    if (q) query.$text = { $search: q };
    if (genre) query.genres = genre;
    if (year) query.year = parseInt(year);
    if (minRating || maxRating) {
      query.rating = {};
      if (minRating) query.rating.$gte = parseFloat(minRating);
      if (maxRating) query.rating.$lte = parseFloat(maxRating);
    }

    const series = await Series.find(query)
      .sort(sort)
      .limit(30)
      .select('title titleKorean poster backdrop rating year genres status');

    res.json({ success: true, data: series, count: series.length });
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
};

// POST /api/series — Admin: create
exports.createSeries = async (req, res) => {
  try {
    const series = await Series.create(req.body);
    res.status(201).json({ success: true, data: series });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/series/:id — Admin: update
exports.updateSeries = async (req, res) => {
  try {
    const series = await Series.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!series) return res.status(404).json({ error: 'Series not found' });
    res.json({ success: true, data: series });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/series/:id — Admin: delete
exports.deleteSeries = async (req, res) => {
  try {
    const series = await Series.findByIdAndDelete(req.params.id);
    if (!series) return res.status(404).json({ error: 'Series not found' });
    res.json({ success: true, message: 'Series deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete series' });
  }
};

// POST /api/series/fetch-tmdb/:tmdbId — Admin: fetch from TMDB
exports.fetchFromTMDB = async (req, res) => {
  try {
    if (!TMDB_KEY) return res.status(500).json({ error: 'TMDB API key not configured' });

    const { tmdbId } = req.params;
    const [tvRes, videosRes] = await Promise.all([
      axios.get(`${TMDB_BASE}/tv/${tmdbId}?api_key=${TMDB_KEY}&language=en-US&append_to_response=credits`),
      axios.get(`${TMDB_BASE}/tv/${tmdbId}/videos?api_key=${TMDB_KEY}&language=en-US`)
    ]);

    const tv = tvRes.data;
    const videos = videosRes.data.results || [];
    const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');

    const seriesData = {
      title: tv.name,
      titleKorean: tv.original_name,
      description: tv.overview,
      year: new Date(tv.first_air_date).getFullYear(),
      rating: Math.round(tv.vote_average * 10) / 10,
      totalRatings: tv.vote_count,
      episodes: tv.number_of_episodes,
      status: tv.status === 'Ended' ? 'completed' : 'ongoing',
      network: tv.networks?.[0]?.name || '',
      poster: tv.poster_path ? `${TMDB_IMG}${tv.poster_path}` : '',
      backdrop: tv.backdrop_path ? `${TMDB_IMG}${tv.backdrop_path}` : '',
      genres: tv.genres?.map(g => g.name).filter(g => ['Romance', 'Action', 'Thriller', 'Comedy', 'Drama', 'Fantasy', 'Crime', 'Mystery'].includes(g)) || [],
      cast: tv.credits?.cast?.slice(0, 5).map(c => ({
        name: c.name,
        character: c.character,
        photo: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : ''
      })) || [],
      director: tv.credits?.crew?.find(c => c.job === 'Director')?.name || '',
      tmdbId: parseInt(tmdbId),
      trailers: trailer ? [{
        language: 'en',
        url: `https://www.youtube.com/watch?v=${trailer.key}`,
        youtubeId: trailer.key,
        title: trailer.name
      }] : []
    };

    res.json({ success: true, data: seriesData });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from TMDB: ' + err.message });
  }
};

// POST /api/series/:id/trailer-view
exports.trackTrailerView = async (req, res) => {
  try {
    await Series.findByIdAndUpdate(req.params.id, { $inc: { trailerViews: 1 } });
    if (req.user) {
      await Activity.create({
        user: req.user._id,
        series: req.params.id,
        type: 'trailer_play',
        metadata: { language: req.body.language }
      });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to track' });
  }
};
