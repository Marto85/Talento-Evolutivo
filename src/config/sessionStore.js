const session = require("express-session");
const Session = require("../models/Session");

const DEFAULT_TTL = 1000 * 60 * 60 * 8;

class MongoSessionStore extends session.Store {
  async get(sid, callback) {
    try {
      const record = await Session.findById(sid).lean();

      if (!record || record.expires <= new Date()) {
        if (record) await Session.deleteOne({ _id: sid });
        return callback(null, null);
      }

      return callback(null, record.session);
    } catch (error) {
      return callback(error);
    }
  }

  async set(sid, sessionData, callback = () => {}) {
    try {
      const expires = sessionData.cookie?.expires
        ? new Date(sessionData.cookie.expires)
        : new Date(Date.now() + DEFAULT_TTL);

      await Session.findByIdAndUpdate(
        sid,
        { _id: sid, session: sessionData, expires },
        { upsert: true, setDefaultsOnInsert: true }
      );

      return callback(null);
    } catch (error) {
      return callback(error);
    }
  }

  async destroy(sid, callback = () => {}) {
    try {
      await Session.deleteOne({ _id: sid });
      return callback(null);
    } catch (error) {
      return callback(error);
    }
  }

  async touch(sid, sessionData, callback = () => {}) {
    try {
      const expires = sessionData.cookie?.expires
        ? new Date(sessionData.cookie.expires)
        : new Date(Date.now() + DEFAULT_TTL);

      await Session.updateOne({ _id: sid }, { expires });
      return callback(null);
    } catch (error) {
      return callback(error);
    }
  }
}

module.exports = { MongoSessionStore };
